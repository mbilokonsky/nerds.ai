export const build_system_message = (purpose: string, do_block: string, do_not_block: string, additional_notes: string, output_instructions: string): string => {
  return `${purpose}
  
${do_block}
${do_not_block}
${additional_notes ?
      `Additional Notes:
${additional_notes}` : ""}

You may have additional instructions supplied at query time. If so, they will appear here - but it's okay if none are provided.
{additional_instructions}
  
${output_instructions}`
}

