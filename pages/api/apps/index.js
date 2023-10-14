// Next.js API route support: https://nextjs.org/docs/api-routes/introduction

export default function handler(req, res) {

    const obj = {
        META: {
            repoNane: "BirdRa1n Apps",
            "repoIcon": "https://usescarlet.com/favicon.png"
        },
        "Other": [
            {
              "name": "GreenIrrigate",
              "version": "1.0.9",
              "icon": "https://usescarlet.com/icon.png",
              "down": "https://download856.mediafire.com/ebmopv87nqxgJSwB2-Ur86h8ndkHwJEeXDby0ifUCln9Ii64-T14WbVGYHJxz9LPPqw0av7iW05aw17tIP20V71MMUbjRZfNxJkphFsmQNSxJrx5SfsGH6pR7Vp20Csq-HRLK1t1S6u96FQAEek0T0NPbK9WXarY1fS6O4nRWml6qw/fgg07q5s1e241go/GreenIrrigate.ipa",
              "description": "This is the standard version of GreenIrrigate.",
              "bundleID": "com.birdra1n.greenirrigate",
              "category": "Alpha",
              "changelog": "- Added fakesign support\n-Added back SSL install support."
            }
          ]
    }
    res.status(200).json(obj)
  }
  