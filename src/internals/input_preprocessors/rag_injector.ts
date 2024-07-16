import { KnowledgeGraphTools } from "../../main.js";
import { NerdInputPreprocessor } from "../types.js";

export const build_rag_injector = (tools: KnowledgeGraphTools): NerdInputPreprocessor => {

  return async (input: string): Promise<string> => {
    const rag_injection = (await tools.do_rag(input)).join("\n\n")

    return `The following information comes from a RAG-based flow. You should derive your response specifically from this information, rather than relying on knowledge latent within your own memory. If the question the user asks cannot be answered using this information, please simply state that you do not have enough information to provide a complete answer - but do the best you can to address the user query with what the rag data within the information below:
    
BEGIN_RAG_DATA---------------------
${rag_injection}
---------------------END_RAG_DATA

${input}`
  }
}