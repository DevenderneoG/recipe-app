const express = require("express");
const cors = require("cors");
const app = express();

const corsOptions = {
    origin: "*",
    Credential: true,
    optionSuccess: 200.
}
app.use(cors(corsOptions));

const { initializeDatabase } = require("./db/db.connect");
const Recipe = require("./models/recipe.models");

app.use(express.json());

initializeDatabase();


async function createRecipe(newRecipe) {
    try {
        const recipe = new Recipe(newRecipe);
        const savedRecipe = await recipe.save();
        console.log("New book data", savedRecipe);
        return savedRecipe;
    } catch (error) {
        throw error
    }
}

app.post("/recipes", async (req, res) => {
    const { title, author, difficulty, prepTime, cookTime, ingredients, instructions, imageUrl } = req.body;

    if (!title || !author || !difficulty || !prepTime || !cookTime || !ingredients || !instructions || !imageUrl) {
        return res.status(400).json({ error: "Missing required fields: title, author, or publishedDate" });
    }

    try {
        const saveRecipe = await createRecipe(req.body);
        res.status(201).json({ message: "Recipe added successfully.", recipe: saveRecipe });
    } catch (error) {
        res.status(500).json({ error: "Failed to add recipe.", details: error.message });
    }
})

async function readAllRecipes() {
    try {
        const allRecipes = await Recipe.find();
        return allRecipes;
    } catch (error) {
        console.log(error)
    }
}

app.get("/recipes", async (req, res) => {
    try {
        const recipes = await readAllRecipes();
        if (recipes.length != 0) {
            res.send(recipes)
        } else {
            res.status(404).json({ error: "No recipe found." })
        }
    } catch (error) {
        res.status(500).json({ error: "Failed to fetch recipe." })
    }
})

async function readRecipeByTitle(recipeTitle) {
    try {
        const recipeData = await Recipe.findOne({ title: recipeTitle });
        return recipeData;
    } catch (error) {
        throw error;
    }
}

app.get("/recipes/:title", async (req, res) => {
    try {
        const recipeByTitle = await readRecipeByTitle(req.params.title);
        if (recipeByTitle) {
            res.json(recipeByTitle)
        } else {
            res.status(200).json({ error: 'Recipe not found.' })
        }
    } catch (error) {
        res.status(500).json({ error: "Failed to fetch Book." })
    }
})

async function readRecipeByAuthor(recipeAuthor) {
    try {
        const recipeDataAuthor = await Recipe.find({ author: recipeAuthor });
        return recipeDataAuthor;
    } catch (error) {
        throw error;
    }
}

app.get("/recipes/author/:authorName", async (req, res) => {
    try {
        const recipeByAuthor = await readRecipeByAuthor(req.params.authorName);
        if (recipeByAuthor) {
            res.json(recipeByAuthor)
        } else {
            res.status(200).json({ error: 'Recipe not found.' })
        }
    } catch (error) {
        res.status(500).json({ error: "Failed to fetch Book." })
    }
})

async function readRecipeByDifficulty(recipeDifficulty) {
    try {
        const recipeDataDifficulty = await Recipe.find({ difficulty: recipeDifficulty });
        return recipeDataDifficulty;
    } catch (error) {
        throw error;
    }
}

app.get("/recipes/difficulty/:difficultyName", async (req, res) => {
    try {
        const recipeDifficulty = await readRecipeByDifficulty(req.params.difficultyName);
        if(recipeDifficulty) {
            res.json(recipeDifficulty);
        } else {
            res.status(200).json({ error: 'Recipe not found.' })
        }
    } catch (error) {
        res.status(500).json({ error: "Failed to fetch Book." })
    }
})

async function readRecipeById(recipeId, dataToUpdate) {
    try {
        const recipeDifficultyUpdate = await Recipe.findByIdAndUpdate(recipeId, dataToUpdate, {new: true});
        return recipeDifficultyUpdate;
    } catch (error) {
        console.log("Error in updating Recipe data", error);
    }
}

app.post("/recipes/:recipeId", async (req, res) => {
    try {
       const updateRecipeById = await readRecipeById(req.params.recipeId, req.body) ;
       if(updateRecipeById) {
        res.status(200).json({message: "Recipe updated successfully.", updateRecipeById: updateRecipeById})
       } else {
        res.status(404).json({error: "Recipe does not exist."})
       }
    } catch (error) {
        res.status(500).json({error: "Failed to update Recipe."}) 
    }
})

async function readRecipeByTitle(recipeTitle, dataToUpdate) {
    try {
        const recipeTitleUpdate = await Recipe.findOneAndUpdate({title: recipeTitle}, {$set: dataToUpdate}, {new: true});
        return recipeTitleUpdate;
    } catch (error) {
        console.log("Error in updating Recipe data", error);
    }
}

app.post("/recipes/recipeTitle/:title", async (req, res) => {
    try {
       const updateRecipeBytitle = await readRecipeByTitle(req.params.title, req.body) ;
       if(updateRecipeBytitle) {
        res.status(200).json({message: "Recipe updated successfully.", updateRecipeBytitle: updateRecipeBytitle})
       } else {
        res.status(404).json({error: "Recipe not found"})
       }
    } catch (error) {
        res.status(500).json({error: "Failed to update Recipe."}) 
    }
})

async function deleteRecipeById (recipeId) {
    try {
      const deleteRecipe = await Recipe.findByIdAndDelete(recipeId);
      return deleteRecipe;
    } catch (error) {
      console.log("Error in Deleting Recipe data", error)
    }
  }
  
  app.delete("/recipes/:recipeId", async (req, res) => {
    try {
      const deletedRecipe = await deleteRecipeById(req.params.recipeId);
      if (deletedRecipe) {
        res.status(200).json({message: "Recipe deleted successfully."})
      } else {
        res.status(404).json({error: "Recipe not found"});
      }
    } catch (error) {
      res.status(500).json({error: "Failed to delete Hotel."})
    }
  })

  
const PORT = 3000;

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`)
})