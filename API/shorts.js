export default async function handler(request, response) {
    const REPO = "Shahadah-studs/BloxdShorts"; 
    const TOKEN = process.env.GH_TOKEN;
    const url = `https://github.com{REPO}/contents/database.json`;

    try {
        let res = await fetch(url, { 
            headers: { 
                "Authorization": `token ${TOKEN}`,
                "User-Agent": "Vercel-Serverless"
            } 
        });
        
        let sha = "";
        let current = [];
        
        if (res.ok) { 
            let data = await res.json(); 
            sha = data.sha; 
            let decoded = Buffer.from(data.content, 'base64').toString('utf8');
            current = JSON.parse(decoded); 
        }
        
        if (request.method === 'POST') {
            const { c, t, u } = request.body;
            current.push({ c, t, u });
            
            let encodedContent = Buffer.from(JSON.stringify(current), 'utf8').toString('base64');
            
            let update = await fetch(url, { 
                method: "PUT", 
                headers: { 
                    "Authorization": `token ${TOKEN}`, 
                    "Content-Type": "application/json", 
                    "User-Agent": "Vercel-Serverless" 
                }, 
                body: JSON.stringify({ 
                    message: "Add short via API", 
                    content: encodedContent, 
                    sha 
                }) 
            });
            
            if (update.ok) return response.status(200).json(current);
            return response.status(500).json({ error: "Failed to update repository database." });
        }
        return response.status(200).json(current);
    } catch (e) { 
        return response.status(500).json({ error: e.message }); 
    }
}

