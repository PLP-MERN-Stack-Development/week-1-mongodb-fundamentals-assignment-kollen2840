const { MongoClient } = require('mongodb');

// MongoDB connection settings
const uri = 'mongodb://localhost:27017';
const dbName = 'plp_bookstore';
const collectionName = 'books';

// Helper: Connect to MongoDB
async function getCollection() {
  const client = new MongoClient(uri);
  await client.connect();
  const db = client.db(dbName);
  return { collection: db.collection(collectionName), client };
}


async function list() {
  const { collection, client } = await getCollection();

  try {
    const books = await collection.find().toArray();
    console.log("All books in the collection:");
    console.log(books);
  } catch (err) {
    console.error("Error fetching books:", err);
  } finally {
    await client.close();
  }
}

async function main() {
  const cmd = process.argv[2];
  const arg1 = process.argv[3] || null;
  const arg2 = process.argv[4] || null;

  switch (cmd) {
    case 'find': {
      if (!arg1) {
        await list();
      } else {
        console.log("Filter arguments detected, implement filter logic here.");
      }
      break;
    }

    
    
    case 'find-by-filter': {
  const filterField = arg1;
  let filterValue = arg2;

  const { collection, client } = await getCollection();

  try {
    // Convert filterValue to number or boolean if applicable
    if (!isNaN(filterValue)) {
      filterValue = Number(filterValue);
    } else if (filterValue.toLowerCase() === 'true') {
      filterValue = true;
    } else if (filterValue.toLowerCase() === 'false') {
      filterValue = false;
    }

    // Build dynamic filter object
    const filter = { [filterField]: filterValue };

    const results = await collection.find(filter).toArray();

    if (results.length === 0) {
      console.log(`No documents found with ${filterField} = ${filterValue}`);
    } else {
      console.log(`Found documents with ${filterField} = ${filterValue}:`);
      console.log(results);
    }
  } catch (error) {
    console.error('Error executing find:', error);
  } finally {
    await client.close();
  }
  break;
}
    case 'update-price': {
      const { collection, client } = await getCollection();
      const result = await collection.updateOne({ title: arg1 }, { $set: { price: Number(arg2) } });
      console.log(`Updated price for "${arg1}":`, result.modifiedCount);
      await client.close();
      break;
    }
    case 'delete-title': {
      const { collection, client } = await getCollection();
      const result = await collection.deleteOne({ title: arg1 });
      console.log(`Deleted "${arg1}":`, result.deletedCount);
      await client.close();
      break;
    }
    case 'find-instock-after': {
      const { collection, client } = await getCollection();
      const books = await collection.find({ in_stock: true, published_year: { $gt: Number(arg1) } }).toArray();
      console.log(books);
      await client.close();
      break;
    }
    case 'avg-price-genre': {
      const { collection, client } = await getCollection();
      const result = await collection.aggregate([
        { $group: { _id: "$genre", avgPrice: { $avg: "$price" } } }
      ]).toArray();
      console.log(result);
      await client.close();
      break;
    }
    case 'author-most-books': {
      const { collection, client } = await getCollection();
      const result = await collection.aggregate([
        { $group: { _id: "$author", count: { $sum: 1 } } },
        { $sort: { count: -1 } },
        { $limit: 1 }
      ]).toArray();
      console.log(result);
      await client.close();
      break;
    }
    case 'group-decade': {
      const { collection, client } = await getCollection();
      const result = await collection.aggregate([
        { $addFields: { decade: { $multiply: [{ $floor: { $divide: ["$published_year", 10] } }, 10] } } },
        { $group: { _id: "$decade", count: { $sum: 1 } } },
        { $sort: { _id: 1 } }
      ]).toArray();
      console.log(result);
      await client.close();
      break;
    }
    case 'sort-price': {
      const { collection, client } = await getCollection();
      const sortOrder = arg1 === 'asc' ? 1 : -1;
      const books = await collection.find({}).sort({ price: sortOrder }).toArray();
      console.log(books);
      await client.close();
      break;
    }
    case 'paginate': {
      const { collection, client } = await getCollection();
      const page = Number(arg1) || 1;
      const perPage = 5;
      const books = await collection.find({}).skip((page - 1) * perPage).limit(perPage).toArray();
      console.log(books);
      await client.close();
      break;
    }
    default:
      console.log(`
Usage:
  node commandLine.js find
  node commandLine.js find-by-filter <filter> <value>
  node commandLine.js update-price "<title>" <price>
  node commandLine.js delete-title "<title>"
  node commandLine.js find-instock-after <year>
  node commandLine.js avg-price-genre
  node commandLine.js author-most-books
  node commandLine.js group-decade
  node commandLine.js sort-price <asc|desc>
  node commandLine.js  paginate <pageNumber>
      `);
  }
}

main();
