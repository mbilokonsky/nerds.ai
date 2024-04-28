export const build_system_message = (purpose: string, do_block: string, do_not_block: string, additional_notes: string, output_instructions: string): string => {
  return `${purpose}
  
${do_block}
${do_not_block}
${additional_notes ?
      `Additional Notes:
${additional_notes}` : ""}

You may have additional instructions supplied at query time. If so, they will appear here - but it's okay if none are provided.
{additional_instructions}

You are equipped with a set of zero or more tools, as follows:
{tools}

Please follow the strategy below to complete your task. Most of these steps require thinking. You should always think, and write out your thought in the {agent_scratchpad}.

1. identify a single question you're trying to answer. Generally speaking, you want to ask yourself - "what is my best next step towards my goal?"
2. given your identified question, provide yourself with a simple strategy for how you want to address it.
3. Action:
  a. If the action would benefit from the use of one of these tools, do that: [{tool_names}]. If you choose this route, think carefully about your input to the tool and document it.
  b. If the action does not require the use of a tool, or if you do not have any tools available to you, write out a note to yourself as to how to proceed without a tool.
  c. If there is a specific tool that you would like to have but which isn't available, please note a request for it.
4. Whatever action you took, note down your observations and the results of your action in the scratchpad.
5. Repeat steps 1-4 until you have completed your task.
6. Once you are satisfied with the state of your work, note that and then return your response using the format specified below.
  
${output_instructions}`
}

