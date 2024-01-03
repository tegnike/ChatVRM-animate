import { NextApiRequest, NextApiResponse } from 'next';
import { exec } from 'child_process';
import fs from 'fs';
import path from 'path';

export default (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method === 'POST') {
    const options = req.body;
    const cmd = `F:/anaconda_envs/momask/python gen_t2m.py --gpu_id 0 --text_prompt "${options.prompt}" --ext ${options.ext}`;
    const cwd = path.join(process.cwd(), 'lib', 'momask-codes');

    exec(cmd, { cwd }, (error, stdout, stderr) => {
      if (error) {
        return res.status(500).json({ error: stderr });
      }

      for (let i = 100; i < 1000; i++) {
        const bvhFile = path.join(cwd, 'generation', options.ext, 'animations', '0', `sample0_repeat0_len${i}_ik.bvh`);
        if (fs.existsSync(bvhFile)) {
          const bvh = fs.readFileSync(bvhFile, 'utf8');
          return res.status(200).json({ result: stdout, bvh });
        }
      }
    });
  } else {
    res.status(405).json({ message: 'Method Not Allowed' });
  }
};
