import { serve } from "https://deno.land/std@0.168.0/http/server.ts"

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const REPLICATE_API_KEY = Deno.env.get('REPLICATE_API_KEY')
    if (!REPLICATE_API_KEY) {
      throw new Error('REPLICATE_API_KEY is not set')
    }

    const { prompt, duration = 8 } = await req.json()
    
    if (!prompt || typeof prompt !== 'string' || !prompt.trim()) {
      return new Response(
        JSON.stringify({ error: "Invalid prompt. Please provide a valid music description." }), 
        {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 400,
        }
      )
    }

    console.log("Generating music with prompt:", prompt)

    // Start the prediction
    const predictionResponse = await fetch("https://api.replicate.com/v1/predictions", {
      method: "POST",
      headers: {
        "Authorization": `Token ${REPLICATE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        version: "671ac645ce5e552cc63a54a2bbff63fcf798043055d2dac5fc9e36a837eedcfb",
        input: {
          prompt: prompt,
          model_version: "stereo-large",
          output_format: "mp3",
          normalization_strategy: "peak",
          duration: Math.min(Math.max(duration, 5), 30), // Clamp between 5-30 seconds
        }
      })
    });

    if (!predictionResponse.ok) {
      const errorText = await predictionResponse.text();
      console.error("Replicate API error:", errorText);
      throw new Error(`Replicate API error: ${predictionResponse.status}`);
    }

    const prediction = await predictionResponse.json();
    console.log("Prediction created:", prediction.id);

    return new Response(
      JSON.stringify({ 
        id: prediction.id,
        status: prediction.status 
      }), 
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      }
    )
  } catch (error) {
    console.error("Error in generate-music function:", error)
    return new Response(
      JSON.stringify({ 
        error: error instanceof Error ? error.message : "An unexpected error occurred" 
      }), 
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500,
      }
    )
  }
})
