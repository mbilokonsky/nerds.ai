export const build_system_message = (purpose: string, do_block: string, do_not_block: string, additional_notes: string, output_format: string): string => {
  return `${purpose}
  
${do_block}
${do_not_block}
${additional_notes ?
      `Additional Notes:
${additional_notes}` : ""}

${output_format}`
}

