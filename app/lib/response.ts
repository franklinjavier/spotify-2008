import { json } from '@remix-run/node'

/**
 * Create a response receiving a JSON object with the status code 400.
 * @example
 * export async function loader({ request }: LoaderFunctionArgs) {
 *   let user = await getUser(request);
 *   throw badRequest<BoundaryData>({ user });
 * }
 */
export function badRequest<Data = unknown>(data: Data, init?: Omit<ResponseInit, 'status'>) {
  return json<Data>(data, { ...init, status: 400 })
}

/**
 * Create a response receiving a JSON object with the status code 401.
 * @example
 * export async function loader({ request }: LoaderFunctionArgs) {
 *   let user = await getUser(request);
 *   throw unauthorized<BoundaryData>({ user });
 * }
 */
export function unauthorized<Data = unknown>(data: Data, init?: Omit<ResponseInit, 'status'>) {
  return json<Data>(data, { ...init, status: 401 })
}

/**
 * Create a response receiving a JSON object with the status code 403.
 * @example
 * export async function loader({ request }: LoaderFunctionArgs) {
 *   let user = await getUser(request);
 *   if (!user.idAdmin) throw forbidden<BoundaryData>({ user });
 * }
 */
export function forbidden<Data = unknown>(data: Data, init?: Omit<ResponseInit, 'status'>) {
  return json<Data>(data, { ...init, status: 403 })
}

/**
 * Create a response receiving a JSON object with the status code 404.
 * @example
 * export async function loader({ request, params }: LoaderFunctionArgs) {
 *   let user = await getUser(request);
 *   if (!db.exists(params.id)) throw notFound<BoundaryData>({ user });
 * }
 */
export function notFound<Data = unknown>(data: Data, init?: Omit<ResponseInit, 'status'>) {
  return json<Data>(data, { ...init, status: 404 })
}

/**
 * Create a response receiving a JSON object with the status code 422.
 * @example
 * export async function loader({ request, params }: LoaderFunctionArgs) {
 *   let user = await getUser(request);
 *   throw unprocessableEntity<BoundaryData>({ user });
 * }
 */
export function unprocessableEntity<Data = unknown>(data: Data, init?: Omit<ResponseInit, 'status'>) {
  return json<Data>(data, { ...init, status: 422 })
}

export type ImageType =
  | 'image/jpeg'
  | 'image/png'
  | 'image/gif'
  | 'image/svg+xml'
  | 'image/webp'
  | 'image/bmp'
  | 'image/avif'

/**
 * Create a response with a image file response.
 * It receives a Buffer, ArrayBuffer or ReadableStream with the image content
 * and set the Content-Type header to the `type` parameter.
 *
 * This is useful to dynamically create a image file from a Resource Route.
 * @example
 * export async function loader({ request }: LoaderFunctionArgs) {
 *   return image(await takeScreenshot(), { type: "image/avif" });
 * }
 */
export function image(
  content: Buffer | ArrayBuffer | ReadableStream,
  { type, ...init }: ResponseInit & { type: ImageType },
): Response {
  let headers = new Headers(init.headers)

  if (!headers.has('Content-Type')) {
    headers.set('Content-Type', type)
  }

  return new Response(content, {
    ...init,
    headers,
  })
}
