document.getElementById('getRecipe').addEventListener('click', async () => {
    document.getElementById('loadingDiv').classList.remove('hidden');
    document.getElementById('getRecipe').disabled = true;

    const recipeName = document.getElementById('recipeName').value;
    if (!recipeName) {
        alert('요리 이름을 입력해주세요.');
        return;
    }

    try {
        const response = await fetch(`/api/recipe?name=${recipeName}`);
        const data = await response.json();
        if(data.error){
            alert(data.error);
            return;
        }

        displayRecipeInfo(data);
        document.getElementById('recipeInfo').classList.remove('hidden');
    } catch (error) {
        if(error){
            alert('문제가 생겼어요 다시 요청해주세요.');
        }
    } finally {
        document.getElementById('loadingDiv').classList.add('hidden');
        document.getElementById('getRecipe').disabled = false;
    }
});

function displayRecipeInfo(data) {
    const recipeContentDiv = document.getElementById('recipeContent');
    recipeContentDiv.innerHTML = `
    <div>
        <h2>${data.recipeName}</h2>
        <h3>재료:</h3>
        <ul>
            ${data.ingredients.map(ingredient => `<li>${ingredient}</li>`).join('')}
        </ul>
        <h3>대체가능 재료:</h3>
        <ul>
            ${Object.entries(data.substitutes).map(([original, substitute]) => `<li>${original} -> ${substitute}</li>`).join('')}
        </ul>
        <h3>요리방법:</h3>
        <ol>
            ${data.method.map(item => `<li>${item}</li>`).join('')}
        </ol>
    </div>
    `;
}

document.getElementById('downloadScreenshot').addEventListener('click', () => {
    const recipeDiv = document.getElementById('recipeDiv');
    
    // 요리명, 현재 날짜와 시간을 포함한 파일명 생성
    const recipeName = document.getElementById('recipeName').value;
    const now = new Date();
    const fileName = `${recipeName}_${now.getFullYear()}${String(now.getMonth() + 1).padStart(2, '0')}${String(now.getDate()).padStart(2, '0')}${String(now.getHours()).padStart(2, '0')}${String(now.getMinutes()).padStart(2, '0')}${String(now.getSeconds()).padStart(2, '0')}.png`;
    
    window.htmlToImage.toPng(recipeDiv)
    .then(dataUrl => {
            const link = document.createElement('a');
            link.href = dataUrl;
            link.download = fileName;
            link.click();
        })
        .catch(error => {
            console.error('Error capturing image:', error);
        });

});
