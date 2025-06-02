const { MongoClient } = require('mongodb');

// Connection URI and database/collection names
const uri = 'mongodb://localhost:27017';
const dbName = 'plp_bookstore';
const collectionName = 'books';

//copy and paste the value into the mongodb in this format db.collection.insertMany(value of addedBooks);
const addedBooks = [
  {
    "title": "Joshua Breeds",
    "author": "Rando Langos",
    "genre": "Hollywoods",
    "published_year": 2018,
    "price": 11.50,
    "in_stock": true,
    "pages": 315,
    "publisher": "Bliqk and Raisan"
  },
  {
    "title": "Silent Horizons",
    "author": "Lena Marquez",
    "genre": "Drama",
    "published_year": 2019,
    "price": 13.75,
    "in_stock": true,
    "pages": 280,
    "publisher": "Sunset Press"
  },
  {
    "title": "Echoes of Eternity",
    "author": "Derek Shaw",
    "genre": "Fantasy",
    "published_year": 2015,
    "price": 15.99,
    "in_stock": false,
    "pages": 420,
    "publisher": "Mystic House"
  },
  {
    "title": "Crimson Tide",
    "author": "Samantha Grey",
    "genre": "Thriller",
    "published_year": 2020,
    "price": 12.00,
    "in_stock": true,
    "pages": 350,
    "publisher": "Edge Books"
  },
  {
    "title": "The Last Ember",
    "author": "Rando Langos",
    "genre": "Adventure",
    "published_year": 2017,
    "price": 14.25,
    "in_stock": true,
    "pages": 390,
    "publisher": "Bliqk and Raisan"
  },
  {
    "title": "Whispering Shadows",
    "author": "Lena Marquez",
    "genre": "Mystery",
    "published_year": 2016,
    "price": 10.50,
    "in_stock": false,
    "pages": 310,
    "publisher": "Sunset Press"
  },
  {
    "title": "Galactic Voyage",
    "author": "Derek Shaw",
    "genre": "Science Fiction",
    "published_year": 2018,
    "price": 16.99,
    "in_stock": true,
    "pages": 450,
    "publisher": "Mystic House"
  },
  {
    "title": "Broken Chains",
    "author": "Samantha Grey",
    "genre": "Drama",
    "published_year": 2019,
    "price": 11.00,
    "in_stock": true,
    "pages": 275,
    "publisher": "Edge Books"
  },
  {
    "title": "The Silent Storm",
    "author": "Rando Langos",
    "genre": "Horror",
    "published_year": 2021,
    "price": 13.00,
    "in_stock": true,
    "pages": 320,
    "publisher": "Bliqk and Raisan"
  },
  {
    "title": "Veil of Secrets",
    "author": "Lena Marquez",
    "genre": "Thriller",
    "published_year": 2017,
    "price": 14.50,
    "in_stock": false,
    "pages": 360,
    "publisher": "Sunset Press"
  },
  {
    "title": "Starlight Chronicles",
    "author": "Derek Shaw",
    "genre": "Fantasy",
    "published_year": 2019,
    "price": 17.25,
    "in_stock": true,
    "pages": 480,
    "publisher": "Mystic House"
  },
  {
    "title": "Edge of Tomorrow",
    "author": "Samantha Grey",
    "genre": "Science Fiction",
    "published_year": 2018,
    "price": 15.00,
    "in_stock": true,
    "pages": 400,
    "publisher": "Edge Books"
  },
  {
    "title": "Fading Light",
    "author": "Rando Langos",
    "genre": "Romance",
    "published_year": 2016,
    "price": 12.75,
    "in_stock": false,
    "pages": 290,
    "publisher": "Bliqk and Raisan"
  },
  {
    "title": "Dark Waters",
    "author": "Lena Marquez",
    "genre": "Horror",
    "published_year": 2020,
    "price": 13.99,
    "in_stock": true,
    "pages": 340,
    "publisher": "Sunset Press"
  },
  {
    "title": "Beyond the Horizon",
    "author": "Derek Shaw",
    "genre": "Adventure",
    "published_year": 2017,
    "price": 14.99,
    "in_stock": true,
    "pages": 375,
    "publisher": "Mystic House"
  }
];



async function runQueries() {
  const client = new MongoClient(uri);

  try {
    await client.connect();
    console.log('Connected to MongoDB server');
    const db = client.db(dbName);
    const collection = db.collection(collectionName);
   //TASK 1, Add books to the database
   console.log('\n  new books already  added are :\n\n', addedBooks);
    // --- TASK 2: Basic CRUD Operations ---

    // 1. Find all books in a specific genre (e.g., "Fiction")
    console.log('\nBooks in "Fiction" genre:');
    const fictionBooks = await collection.find({ genre: "Fiction" }).toArray();
    console.log(fictionBooks);

    // 2. Find books published after a certain year (e.g., 1950)
    console.log('\nBooks published after 1950:');
    const recentBooks = await collection.find({ published_year: { $gt: 1950 } }).toArray();
    console.log(recentBooks);

    // 3. Find books by a specific author (e.g., "George Orwell")
    console.log('\nBooks by "George Orwell":');
    const orwellBooks = await collection.find({ author: "George Orwell" }).toArray();
    console.log(orwellBooks);

    // 4. Update the price of a specific book
    const updateResult = await collection.updateOne(
      { title: "The Great Gatsby" },
      { $set: { price: 12.99 } }
    );
    console.log('\nUpdated "The Great Gatsby" price:', updateResult.modifiedCount);

    // 5. Delete a book by its title (e.g., "Moby Dick")
    const deleteResult = await collection.deleteOne({ title: "Moby Dick" });
    console.log('\nDeleted "Moby Dick":', deleteResult.deletedCount);

    // --- TASK 3: Advanced Queries ---

    // 6. Find books in stock AND published after 2010 (note: none in your sample, but query is:
    console.log('\nBooks in stock and published after 2010:');
    const inStockRecent = await collection.find({
      in_stock: true,
      published_year: { $gt: 2010 }
    }).toArray();
    console.log(inStockRecent);

    // 7. Projection: title, author, price
    console.log('\nBooks with only title, author, and price:');
    const projectedBooks = await collection.find({}, { projection: { title: 1, author: 1, price: 1, _id: 0 } }).toArray();
    console.log(projectedBooks);

    // 8. Sort by price (ascending and descending)
    console.log('\nBooks sorted by price (ascending):');
    const ascPrice = await collection.find({}).sort({ price: 1 }).toArray();
    console.log(ascPrice);

    console.log('\nBooks sorted by price (descending):');
    const descPrice = await collection.find({}).sort({ price: -1 }).toArray();
    console.log(descPrice);

    // 9. Pagination: 5 books per page, page 1 (skip 0, limit 5)
    console.log('\nPagination: Page 1 (5 books):');
    const page1 = await collection.find({}).skip(0).limit(5).toArray();
    console.log(page1);

    // --- TASK 4: Aggregation Pipeline ---

    // 10. Average price by genre
    console.log('\nAverage price by genre:');
    const avgPriceByGenre = await collection.aggregate([
      { $group: { _id: "$genre", avgPrice: { $avg: "$price" } } }
    ]).toArray();
    console.log(avgPriceByGenre);

    // 11. Author with most books
    console.log('\nAuthor with most books:');
    const authorMostBooks = await collection.aggregate([
      { $group: { _id: "$author", count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: 1 }
    ]).toArray();
    console.log(authorMostBooks);

    // 12. Group by publication decade and count
    console.log('\nBooks grouped by publication decade and counted:');
    const byDecade = await collection.aggregate([
      { $addFields: { decade: { $multiply: [ { $floor: { $divide: [ "$published_year", 10 ] } }, 10 ] } } },
      { $group: { _id: "$decade", count: { $sum: 1 } } },
      { $sort: { _id: 1 } }
    ]).toArray();
    console.log(byDecade);

    // --- TASK 5: Indexing ---

    // 13. Create index on title
    await collection.createIndex({ title: 1 });
    console.log('\nCreated index on "title" field');

    // 14. Create compound index on author and published_year
    await collection.createIndex({ author: 1, published_year: 1 });
    console.log('\nCreated compound index on "author" and "published_year"');

    // 15. Use explain() to show performance improvement
    const explainCursor = await collection.find({ title: "1984" }).explain("executionStats");
    console.log('\nExecution stats for a query using the title index:');
    console.log(explainCursor.executionStats);

  } catch (err) {
    console.error('Error occurred:', err);
  } finally {
    await client.close();
    console.log('Connection closed');
  }
}

runQueries().catch(console.error);
