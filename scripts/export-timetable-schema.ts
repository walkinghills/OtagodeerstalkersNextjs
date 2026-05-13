import { zodToJsonSchema } from 'zod-to-json-schema'
import { TimetableSchema } from '../lib/timetable'
import fs from 'fs'
import path from 'path'

const schema = zodToJsonSchema(TimetableSchema, 'Timetable')
const outPath = path.join(process.cwd(), 'schemas', 'timetable.schema.json')
fs.mkdirSync(path.dirname(outPath), { recursive: true })
fs.writeFileSync(outPath, JSON.stringify(schema, null, 2))
console.log('Wrote', outPath)
