export const build_system_message = (purpose: string, do_block: string, do_not_block: string, additional_notes: string, output_schema: string): string => {
  return `${purpose}
  
${do_block}
${do_not_block}
${additional_notes ?
      `Additional Notes:
${additional_notes}` : ""

    }
    
Please return your output in compliance with the following JSON schema. 
DO NOT wrap the output in any kind of text or even any kind of code fence, it is essential that you return valid JSON that is machine parsable.
The first character of your output MUST be '{{' and the last character MUST be '}}'.

Output Schema:
${output_schema}`
}

