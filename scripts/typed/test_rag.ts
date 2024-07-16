import 'dotenv/config';
import { PineconeKnowledgeGraphTools } from "../../src/prebuilt/graph/pinecone_tools.js";
import { Pinecone } from "@pinecone-database/pinecone";
import { summary_cruncher_nerd } from "../../src/prebuilt/graph/summary_cruncher_nerd.js";
const cruncher = await summary_cruncher_nerd.bindToModel("claude-3-5-sonnet-20240620")
const pinecone = new Pinecone();

const vector_graph_tools: PineconeKnowledgeGraphTools = new PineconeKnowledgeGraphTools(pinecone);

const questions = [
  "What are the primary advantages of using typescript?",
  "What are some tricks to make typescript compilation faster?",
  "What are the best practices for using typescript with react?",
  "What are some common pitfalls to avoid when using typescript?",
  "What are some common typescript design patterns?",
  "What are the built-in types in typescript?",
  "How does the Parameters utility type work in typescript?"
]

const main = async () => {
  const answers = []

  for (let i = 0; i < questions.length; i++) {
    const question = questions[i];
    const rag_output = await vector_graph_tools.do_rag(question)
    const structured_rag_output = rag_output.filter((item) => item.length > 0).map(item => item.trim()).join("\n")

    const crunch_query = `User Input: ${question}
  
RAG output: ${structured_rag_output}`

    const crunched_output = await cruncher.invoke(crunch_query, "")
    const answer = crunched_output.split("---\n")[1].trim()
    answers.push(answer)
  }

  for (let i = 0; i < answers.length; i++) {
    console.log(`## Question: ${questions[i]}`)
    console.log(answers[i])
    console.log("\n\n")
  }
}

main().then(() => {
  console.log("Done.")
  process.exit(0)
});