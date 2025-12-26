import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface TrendResearchRequest {
  keywords?: string[];
  platforms?: string[];
  timeRange?: 'day' | 'week' | 'month';
  limit?: number;
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { keywords, platforms, timeRange, limit } = await req.json() as TrendResearchRequest;

    const FIRECRAWL_API_KEY = Deno.env.get('FIRECRAWL_API_KEY');
    if (!FIRECRAWL_API_KEY) {
      console.error('FIRECRAWL_API_KEY not configured');
      return new Response(
        JSON.stringify({ success: false, error: 'Firecrawl not configured' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const searchKeywords = keywords || ['viral AI video', 'AI generated content trending'];
    const targetPlatforms = platforms || ['tiktok', 'instagram', 'youtube'];
    const searchLimit = limit || 10;

    // Time filter for Firecrawl search
    const tbsMap: Record<string, string> = {
      'day': 'qdr:d',
      'week': 'qdr:w', 
      'month': 'qdr:m'
    };
    const tbs = tbsMap[timeRange || 'week'];

    console.log('Starting trend research with keywords:', searchKeywords);

    const allResults: any[] = [];

    // Search for each platform
    for (const platform of targetPlatforms) {
      for (const keyword of searchKeywords) {
        const query = `${keyword} ${platform} viral high engagement 2024`;
        
        console.log(`Searching: ${query}`);

        try {
          const response = await fetch('https://api.firecrawl.dev/v1/search', {
            method: 'POST',
            headers: {
              'Authorization': `Bearer ${FIRECRAWL_API_KEY}`,
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              query,
              limit: Math.ceil(searchLimit / (targetPlatforms.length * searchKeywords.length)),
              tbs,
              scrapeOptions: {
                formats: ['markdown', 'links']
              }
            }),
          });

          if (response.ok) {
            const data = await response.json();
            if (data.success && data.data) {
              const resultsWithMeta = data.data.map((item: any) => ({
                ...item,
                platform,
                keyword,
                searchedAt: new Date().toISOString()
              }));
              allResults.push(...resultsWithMeta);
            }
          } else {
            console.error(`Search failed for ${platform}/${keyword}:`, await response.text());
          }
        } catch (error) {
          console.error(`Error searching ${platform}/${keyword}:`, error);
        }
      }
    }

    console.log(`Found ${allResults.length} results`);

    return new Response(
      JSON.stringify({
        success: true,
        results: allResults,
        meta: {
          keywords: searchKeywords,
          platforms: targetPlatforms,
          timeRange: timeRange || 'week',
          totalResults: allResults.length
        }
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Trend research error:', error);
    return new Response(
      JSON.stringify({ success: false, error: error instanceof Error ? error.message : 'Unknown error' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
