export interface ProductRecommendation {
  name: string;
  price: string;
  features: string[];
  reason: string;
  amazonSearchQuery?: string;
}

export interface ParsedRecommendation {
  products: ProductRecommendation[];
}

export function parseRecommendationResponse(response: string): ParsedRecommendation {
  console.log('Parsing response:', response.substring(0, 200) + '...');
  
  const products: ProductRecommendation[] = [];

  try {
    // XML形式の解析を試行
    const xmlMatch = response.match(/<recommendations>([\s\S]*?)<\/recommendations>/);
    if (xmlMatch) {
      const xmlContent = xmlMatch[1];
      const productMatches = xmlContent.match(/<product>([\s\S]*?)<\/product>/g);
      
      if (productMatches) {
        productMatches.forEach((productXml) => {
          const nameMatch = productXml.match(/<name>(.*?)<\/name>/);
          const priceMatch = productXml.match(/<price>(.*?)<\/price>/);
          const featuresMatch = productXml.match(/<features>(.*?)<\/features>/);
          const reasonMatch = productXml.match(/<reason>(.*?)<\/reason>/);
          
          if (nameMatch && priceMatch) {
            products.push({
              name: nameMatch[1].trim(),
              price: priceMatch[1].trim(),
              features: featuresMatch ? [featuresMatch[1].trim()] : ['詳細情報を確認してください'],
              reason: reasonMatch ? reasonMatch[1].trim() : 'あなたにぴったりの商品です'
            });
          }
        });
      }
    }
  } catch (error) {
    console.error('XML parsing error:', error);
  }

  // XML解析が失敗した場合のフォールバック
  if (products.length === 0) {
    console.log('XML parsing failed, trying fallback...');
    
    const lines = response.split('\n');
    let currentProduct: Partial<ProductRecommendation> = {};
    let inProductsSection = false;

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i].trim();
      
      // 商品セクションの開始を検出
      if (line.includes('おすすめ商品') || line.includes('### おすすめ商品')) {
        inProductsSection = true;
        continue;
      }

      // 商品情報の解析 - より柔軟なパターンマッチング
      if (inProductsSection && (line.match(/^\d+\.\s*\*\*.*\*\*:/) || line.match(/^\d+\.\s*.*:/))) {
        // 前の商品を保存
        if (currentProduct.name && currentProduct.price) {
          products.push(currentProduct as ProductRecommendation);
        }
        
        // 新しい商品の開始
        let nameMatch = line.match(/\*\*(.*?)\*\*:/);
        if (!nameMatch) {
          nameMatch = line.match(/^\d+\.\s*(.*?):/);
        }
        
        currentProduct = {
          name: nameMatch ? nameMatch[1].trim() : '',
          price: '',
          features: [],
          reason: ''
        };
        continue;
      }

      // 価格の解析 - より柔軟なパターン
      if (inProductsSection && (line.includes('価格:') || line.includes('価格：')) && currentProduct.name) {
        const priceMatch = line.match(/価格[：:]\s*(.*?)(?:\s|$)/);
        if (priceMatch) {
          currentProduct.price = priceMatch[1].trim();
        }
        continue;
      }

      // 特徴の解析 - より柔軟なパターン
      if (inProductsSection && (line.includes('特徴:') || line.includes('特徴：')) && currentProduct.name) {
        const featureMatch = line.match(/特徴[：:]\s*(.*?)(?:\s|$)/);
        if (featureMatch) {
          currentProduct.features = [featureMatch[1].trim()];
        }
        continue;
      }

      // おすすめ理由の解析 - より柔軟なパターン
      if (inProductsSection && (line.includes('おすすめ理由:') || line.includes('おすすめ理由：')) && currentProduct.name) {
        const reasonMatch = line.match(/おすすめ理由[：:]\s*(.*?)(?:\s|$)/);
        if (reasonMatch) {
          currentProduct.reason = reasonMatch[1].trim();
        }
        continue;
      }
    }

    // 最後の商品を保存
    if (currentProduct.name && currentProduct.price) {
      products.push(currentProduct as ProductRecommendation);
    }
  }

  // Amazon検索クエリを生成
  products.forEach(product => {
    product.amazonSearchQuery = encodeURIComponent(`${product.name} ${product.price}`);
  });

  console.log('Parsed products:', products);

  return { products };
} 