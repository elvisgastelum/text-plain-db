const fs = require('node:fs');

// FORMAT OF THE FILE
// Id	String
// Age	Int
// Name	String
// Created	Time.Datetime
//
// Id	1
// Age	30
// Name	John
// Created	2019-01-01T00:00:00Z
//
// Id	2
// Age	20
// Name	Bob
// Created	2019-01-01T00:00:00Z
const data = fs.readFileSync('person.table', 'utf8');

// Get values from the file
// every record is separated by a empty line
// the first record is the schema
// the rest of the records are the values
// the values are separated by tabs
// and store them in an array
// return the result in an object with the schema and the values
// the values should be a record with the schema as keys
// and the values as values
const getTable = (data) => {
  const lines = data.split('\n\n');
  const definition = lines[0].split('\n');
  const values = lines.slice(1);

  return {
	  schema: definition.reduce((acc, curr) => {
		  const [key, value] = curr.split('\t');
		  acc[key] = value;
		  return acc;
			  }, {}),
    records: values.map((record) => {
      return record.split('\n').reduce((acc, curr) => {
	if (curr === '') return acc;

	const [key, value] = curr.split('\t');
	acc[key] = value;
	return acc;
      }, {});
    }),
  };
}

const table = getTable(data);

console.log(table);
