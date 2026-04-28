export const Get = (req: any, res: any) => { }

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
