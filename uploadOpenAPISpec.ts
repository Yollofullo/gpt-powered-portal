
import { serve } from 'https://deno.land/std@0.177.0/http/server.ts'

serve(async (req) => {
  try {
    const body = await req.json();
    console.log('🔍 [uploadOpenAPISpec.ts] const body = await req.json();');
    const { filename, content } = body;
    console.log('🔍 [uploadOpenAPISpec.ts] const { filename, content } = body;');

    const kv = await Deno.openKv();
    console.log('🔍 [uploadOpenAPISpec.ts] const kv = await Deno.openKv();');
    await kv.set(["plugin_specs", filename], content);

    return new Response(JSON.stringify({ status: "success", filename }), {
      headers: { "Content-Type": "application/json" },
      status: 200
    });
  } catch (e) {
    return new Response(JSON.stringify({ status: "error", message: e.message }), {
      headers: { "Content-Type": "application/json" },
      status: 500
    });
  }
});
