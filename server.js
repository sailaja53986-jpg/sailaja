const express = require("express");
const cors = require("cors");
require("dotenv").config();

const { createClient } = require("@supabase/supabase-js");

const app = express();

app.use(cors());
app.use(express.json());

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_KEY
);

app.post("/signup", async (req, res) => {

  try {

    const { username, mobile } = req.body;

    if (!username || !mobile) {

      return res.status(400).json({
        error: "All fields required"
      });

    }

    const { data: existingUser } = await supabase
      .from("users")
      .select("*")
      .eq("mobile", mobile)
      .single();

    if (existingUser) {

      return res.status(400).json({
        error: "Mobile already registered"
      });

    }

    const { data, error } = await supabase
      .from("users")
      .insert([
        {
          username,
          mobile
        }
      ]);

    if (error) {

      return res.status(500).json({
        error: error.message
      });

    }

    res.json({
      success: true,
      data
    });

  } catch (err) {

    res.status(500).json({
      error: "Server Error"
    });

  }

});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {

  console.log("Server Running On Port " + PORT);

});
