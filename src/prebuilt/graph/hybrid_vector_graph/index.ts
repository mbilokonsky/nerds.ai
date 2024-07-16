import { Edge, GraphData } from "../index.js"
import { CanonicalConceptMapping, Concept, ConceptToolInput, ExistingLabels } from "../knowledge_extraction_nerd.js"

// TODO - finish this and migrate stuff from ../pinecone_tools.ts into a new file in this folder.

export type HybridVectorGraph = {
  get_vector_matches: (input: string) => Promise<string[]>
  get_batch_vector_matches: (input: string[]) => Promise<string[][]>
  write_to_hybrid_vector_graph: (data: GraphData) => Promise<string>

  list_existing_edge_types: () => Promise<string[]>



  concept_canonizer: (concepts: ConceptToolInput) => Promise<Array<CanonicalConceptMapping>>
  graph_writer: (data: GraphData) => Promise<string>
  list_labels: () => Promise<ExistingLabels>
  get_existing_relationships_for_source: (source_id) => Promise<Edge[]>
  get_existing_concepts_for_source: (source_id) => Promise<Concept[]>
  lookup: (concept: string) => Promise<string[]>
}