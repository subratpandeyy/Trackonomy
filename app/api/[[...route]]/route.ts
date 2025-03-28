import { Hono } from 'hono'
import { handle } from 'hono/vercel'
import { z } from 'zod'
import { zValidator } from '@hono/zod-validator'
import accounts from "./accounts"
import { HTTPException } from 'hono/http-exception'
import categories from './categories'
export const runtime = 'edge'


const app = new Hono().basePath('/api')

app.onError((err, c) => {
  if(err instanceof HTTPException) {
    return err.getResponse();
  }

  return c.json({ error: "Internal Error" }, 500);
})

const routes = app
  .route("/accounts", accounts)
  .route("/categories", categories);

export const GET = handle(app);
export const POST = handle(app);
export const PATCH = handle(app);
export const DELETE = handle(app);

export type AppType = typeof routes;