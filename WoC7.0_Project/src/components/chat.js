import { GoogleGenerativeAI } from "@google/generative-ai";
import dotenv from "dotenv"
const genAI = new GoogleGenerativeAI(process.env.API_KEY);

const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

const prompt = "Explain how AI works";

const generate = aysnc() => {
    try{
        const result = await model.generateContent(prompt);
        console.log(result.response.text());
    }catch(err){
        console.log(err);
    }
}

generate();