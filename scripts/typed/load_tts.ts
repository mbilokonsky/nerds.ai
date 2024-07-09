import 'dotenv/config';
import { KnowledgeExtractionNerd } from "../../src/prebuilt/graph/knowledge_extraction_nerd.js"
import { PineconeKnowledgeGraphTools } from "../../src/prebuilt/graph/pinecone_tools.js"
import { Pinecone } from "@pinecone-database/pinecone"
import { readFileSync, writeFileSync } from "fs"
import neo4j from 'neo4j-driver'
import { GraphResult } from '../../src/prebuilt/graph/index.js';
import { programming_graph_guidance } from "../../src/prebuilt/graph/guidance/index.js"
import { Client } from "langsmith";

const client = new Client();
console.log("Langchain Client initialized.", client.listProjects())

const reset_neo4j = async (): Promise<string> => {
  console.log("Resetting Neo4J")
  const graph_uri = process.env.NEO4J_URI
  const graph_user = process.env.NEO4J_USERNAME
  const graph_password = process.env.NEO4J_PASSWORD
  let driver;

  try {
    driver = neo4j.driver(graph_uri, neo4j.auth.basic(graph_user, graph_password))
    const serverInfo = await driver.getServerInfo()
    console.log("Connection to Neo4J Server Established")
    console.log(serverInfo)
  } catch (err) {
    console.error("Error connecting to Neo4J", err)
    throw err
  }

  try {
    console.log("Deleting all nodes and relationships in Neo4J")
    const session = driver.session()
    await session.run("MATCH (n) DETACH DELETE n")
    await session.close()
    await driver.close()
    console.log("Neo4J reset complete")
  } catch (e) {
    console.error("Error resetting Neo4J", e)
    throw e
  }

  return "ok"
}

function timeout(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

const reset_pinecone_index = async (index_name: string): Promise<string> => {
  console.log(`Resetting pinecone index ${index_name} [THIS IS LOSSY, ALL DATA WILL BE LOST]`)
  try {
    await pinecone.deleteIndex(index_name)
    console.log(`Deleted index ${index_name}.`)
  } catch (e) {
    console.log(`${index_name} index doesn't exist.`)
  } finally {
    console.log(`Creating index ${index_name} in five seconds...`)
    await timeout(5000)
    await pinecone.createIndex({
      name: index_name,
      dimension: 1536,
      metric: 'cosine',
      spec: {
        serverless: {
          cloud: 'aws',
          region: 'us-east-1'
        }
      }
    })

    console.log(`Created index ${index_name}.`)
  }

  return "ok"
}

const reset_data = async (do_reset = false): Promise<string> => {
  if (!do_reset) return "skipped"
  console.log("Resetting data")
  await reset_neo4j()
  await reset_pinecone_index("concepts")
  return "ok"
}

const pinecone = new Pinecone()
const pinecone_tools = new PineconeKnowledgeGraphTools(pinecone)
const unbound_nerd = new KnowledgeExtractionNerd(pinecone_tools, programming_graph_guidance)

const source_plaintext = readFileSync('./sources/total_typescript.json', "utf-8")
const json = JSON.parse(source_plaintext).result

const inputs = [];


const parse_resource = (item, title_prefix): void => {
  console.log('Parsing resource:');
  console.dir(item);

  const title = `${title_prefix} > ${item.title}`

  const source_id = item.slug?.current || item._id

  if (item.resources) {
    item.resources.forEach(item => item ? parse_resource(item, title) : console.log("Weird, no item in resources", item))
  } else if (item.body) {
    const body = item.body
    const source_text = `Title: ${title}
Type: ${item._type}
Description: ${item.description}
Body: ${body}`

    if (source_id && body) {
      inputs.push({ source_id, source_text })
    }
  }
}

json.forEach((item, i) => item ? parse_resource(item, "Total Typescript") : console.log("Weird, no item at index ", i))

type ResultType = {
  [key: string]: GraphResult | string
}
const main = async (): Promise<ResultType> => {
  const reset_status = await reset_data(true)
  console.log(`Reset status: ${reset_status}`)

  const nerd = await unbound_nerd.bindToModel("claude-3-5-sonnet-20240620")
  const results = {}

  console.log(`Now processing ${inputs.length} sources into knowledge graph...`)

  for (let i = 0; i < inputs.length; i++) {
    const input = inputs[i]

    const split = input.source_text.split("Body: ")
    const prefix = split[0]
    const body = split[1]
    const [title, type, summary] = prefix.split("\n")
    console.log(`Processing (${i + 1}/${inputs.length}) >> ${title} [${type}, ${body.length} characters] - ${summary}`)
    try {
      const result = await nerd.invoke(input, "")
      results[input.source_id] = result
      console.log(` Processed ${input.source_id}
${JSON.stringify(result, null, 2)}


`)
    } catch (e) {
      console.error(` Error processing ${input.source_id}: ${e.message}`)
      console.error(e)
      results[input.source_id] = e.message
    }

  }

  return results
}

main().then((results: ResultType) => {
  writeFileSync('./demos/graph/total_typescript_results.json', JSON.stringify(results, null, 2))
  process.exit(0)
})