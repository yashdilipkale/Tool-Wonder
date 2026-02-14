import React, { useState, useRef, useCallback } from 'react';
import { Pipette, Upload, Copy, Palette, Eye, EyeOff } from 'lucide-react';
import { useTheme } from "../ThemeContext";

interface ColorInfo {
  hex: string;
  rgb: string;
  hsl: string;
  count: number;
  percentage: number;
}

const ImageColorPicker: React.FC = () => {
  const { theme } = useTheme();
  const [image, setImage] = useState<string | null>(null);
  const [colors, setColors] = useState<ColorInfo[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [showPreview, setShowPreview] = useState(true);
  const [error, setError] = useState('');
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const rgbToHex = (r: number, g: number, b: number) =>
    "#" + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1);

  const rgbToHsl = (r: number, g: number, b: number) => {
    r/=255; g/=255; b/=255;
    const max=Math.max(r,g,b), min=Math.min(r,g,b);
    let h=0,s=0,l=(max+min)/2;
    if(max!==min){
      const d=max-min;
      s=l>0.5? d/(2-max-min): d/(max+min);
      switch(max){
        case r:h=(g-b)/d+(g<b?6:0);break;
        case g:h=(b-r)/d+2;break;
        case b:h=(r-g)/d+4;break;
      }
      h/=6;
    }
    return `hsl(${Math.round(h*360)}, ${Math.round(s*100)}%, ${Math.round(l*100)}%)`;
  };

  const extractColors = useCallback(async (imageSrc: string) => {
    setIsProcessing(true);
    setError('');
    try {
      const img=new Image();
      img.src=imageSrc;
      await new Promise((res,rej)=>{img.onload=res;img.onerror=rej});

      const canvas=canvasRef.current!;
      const ctx=canvas.getContext('2d')!;
      const maxSize=200;
      let {width,height}=img;
      if(width>height){ if(width>maxSize){ height=(height*maxSize)/width; width=maxSize;}}
      else{ if(height>maxSize){ width=(width*maxSize)/height; height=maxSize;}}

      canvas.width=width;
      canvas.height=height;
      ctx.drawImage(img,0,0,width,height);

      const {data}=ctx.getImageData(0,0,width,height);
      const colorCount:Record<string,number>={};

      for(let i=0;i<data.length;i+=16){
        const r=data[i], g=data[i+1], b=data[i+2], a=data[i+3];
        if(a<128) continue;
        const hex=rgbToHex(r,g,b);
        colorCount[hex]=(colorCount[hex]||0)+1;
      }

      const total=Object.values(colorCount).reduce((a,b)=>a+b,0);
      const result:ColorInfo[]=Object.entries(colorCount)
        .map(([hex,count])=>({
          hex,
          rgb:`rgb(${parseInt(hex.slice(1,3),16)}, ${parseInt(hex.slice(3,5),16)}, ${parseInt(hex.slice(5,7),16)})`,
          hsl:rgbToHsl(parseInt(hex.slice(1,3),16),parseInt(hex.slice(3,5),16),parseInt(hex.slice(5,7),16)),
          count,
          percentage:(count/total)*100
        }))
        .sort((a,b)=>b.count-a.count)
        .slice(0,20);

      setColors(result);
    } catch(err){
      setError('Image processing failed');
    } finally{
      setIsProcessing(false);
    }
  },[]);

  const handleUpload=(e:React.ChangeEvent<HTMLInputElement>)=>{
    const file=e.target.files?.[0];
    if(!file) return;
    const reader=new FileReader();
    reader.onload=e=>{
      const res=e.target?.result as string;
      setImage(res);
      extractColors(res);
    };
    reader.readAsDataURL(file);
  };

  const copy=(text:string)=>navigator.clipboard.writeText(text);

  return (
    <div className="max-w-6xl mx-auto px-4 py-10">

      {/* Header */}
      <div className="text-center mb-8">
        <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-to-r from-indigo-500 to-purple-600 text-white shadow-lg mb-4">
          <Pipette/>
        </div>
        <h1 className="text-3xl font-bold text-slate-900 dark:text-white">
          Image Color Picker
        </h1>
        <p className="text-slate-500 dark:text-slate-400 mt-2">
          Extract professional color palettes instantly from any image
        </p>
      </div>

      {/* Upload */}
      <div
        onClick={()=>fileInputRef.current?.click()}
        className="border-2 border-dashed border-slate-300 dark:border-slate-600 hover:border-indigo-500 rounded-2xl p-10 text-center cursor-pointer transition-colors"
      >
        {image ? (
          <img src={image} className="mx-auto max-h-60 rounded-xl shadow"/>
        ):( 
          <div className="space-y-3">
            <Upload className="mx-auto text-slate-400 dark:text-slate-500" size={40}/>
            <p className="font-medium text-slate-900 dark:text-white">Click to Upload Image</p>
          </div>
        )}
        <input ref={fileInputRef} hidden type="file" accept="image/*" onChange={handleUpload}/>
      </div>

      {/* Loading */}
      {isProcessing && (
        <div className="text-center mt-6 text-slate-900 dark:text-white">Processing...</div>
      )}

      {/* Palette */}
      {colors.length>0 && (
        <div className="mt-10">
          <h3 className="text-xl font-semibold mb-5 flex items-center gap-2 text-slate-900 dark:text-white">
            <Palette/> Color Palette
          </h3>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {colors.map((c,i)=>(
              <div key={i} className="rounded-xl p-3 bg-white dark:bg-slate-800 shadow hover:shadow-lg transition-colors">
                <div style={{background:c.hex}} className="h-16 rounded mb-2"/>
                <div className="text-xs font-mono text-slate-900 dark:text-white">{c.hex}</div>
                <button
                  onClick={()=>copy(c.hex)}
                  className="mt-2 w-full text-xs py-1 rounded-lg bg-indigo-100 dark:bg-indigo-900/30 hover:bg-indigo-200 dark:hover:bg-indigo-900/50 transition-colors"
                >
                  Copy
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      <canvas ref={canvasRef} className="hidden"/>
    </div>
  );
};

export default ImageColorPicker;
