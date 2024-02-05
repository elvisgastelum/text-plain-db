import { join } from "https://deno.land/std@0.188.0/path/mod.ts";
import * as path from "https://deno.land/std@0.188.0/path/mod.ts";
import { IReader, IRecord, Reader } from "../mod.ts";

const __filename = path.fromFileUrl(import.meta.url);
const __dirname = path.dirname(__filename);

interface PersonRecord extends IRecord {
  Age: number;
  Name: string;
  Created: string;
}

class PersonReader
  extends Reader<PersonRecord>
  implements IReader<PersonRecord>
{
  constructor(path: string) {
    super(path);
  }

  public async getRecords() {
    // Do some custom logic here
    return super.getRecords();
  }

  public async getRecord(id: string) {
    // Do some custom logic here
    return super.getRecord(id);
  }

  public async getRecordsBy(filter: Partial<PersonRecord>) {
    // Do some custom logic here
    return super.getRecordsBy(filter);
  }
}

const personReader = new PersonReader(join(__dirname, "person.records"));

const [john] = await personReader.getRecordsBy({
  Name: "John",
});

console.log(`${john.Name}'s age is`, john.Age);
console.log(`${john.Name}'s record was created on`, new Date(john.Created).toDateString());
