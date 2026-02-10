document.getElementById('checkBtn').addEventListener('click', async () => {
    const foodInput = document.getElementById('foodInput').value.trim();
    const resultDiv = document.getElementById('result');

    if (!foodInput) {
        resultDiv.innerText = "Please enter some food items.";
        return;
    }

    resultDiv.innerText = "Loading...";

    try {
        // Call your backend
        const res = await fetch(`http://localhost:4000/api/recipe?q=${encodeURIComponent(foodInput)}`);
        const data = await res.json();
        console.log("Backend response:", data);

        if (!data.items || data.items.length === 0) {
            resultDiv.innerText = "No nutrition data found.";
            return;
        }

        let outputText = "=== Per Item Nutrition ===\n\n";
        let totals = { calories: 0, protein: 0, carbs: 0, fat: 0 };

        data.items.forEach(item => {
            outputText += `Name: ${item.name}\nCalories: ${item.calories} kcal\nProtein: ${item.protein_g} g\nCarbs: ${item.carbohydrates_total_g} g\nFat: ${item.fat_total_g} g\n----------------\n`;

            totals.calories += item.calories;
            totals.protein += item.protein_g;
            totals.carbs += item.carbohydrates_total_g;
            totals.fat += item.fat_total_g;
        });

        outputText += "\n=== Total Nutrition ===\n";
        outputText += `Calories: ${totals.calories.toFixed(2)} kcal\n`;
        outputText += `Protein: ${totals.protein.toFixed(2)} g\n`;
        outputText += `Carbs: ${totals.carbs.toFixed(2)} g\n`;
        outputText += `Fat: ${totals.fat.toFixed(2)} g\n`;

        resultDiv.innerText = outputText;

    } catch (err) {
        console.error("Frontend error:", err);
        resultDiv.innerText = "Error fetching nutrition data.";
    }
});
