import pool from "../src/db";

export const GetData = async (req: any, res: any) => { 
try{
  const result = await pool.query('SELECT * FROM clams.categories');
  
  console.log(result.rows);
  return res.status(200).json({data: result.rows ?? "no data found"});
}
catch(e: any){
  return res.status(400).json({data: `data not found`, status: 'failed', error: e.message})
}

}

export const Post = (req: any, res: any) => {
  try{
  const data = req.body;
  res.status(201).json({ message: 'Item created', data });
  }
  catch(error: any) {
    res.status(500).json({ message: 'Error creating item', error });
  }
}

export const Update = (req: any, res: any) => {}

export const Delete = (req: any, res: any) => {}
