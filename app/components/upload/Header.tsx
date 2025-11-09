"use client"
import SVGComponent from "@/app/components/svgs/fileDownload"
export default function Header() {

  return (
    <div className="text-center mb-8">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-primary text-primary-foreground rounded-2xl mb-4">
          <SVGComponent className="w-8 h-8" stroke="currentColor" />
        </div>
        <h1 className="text-4xl font-bold text-foreground mb-3 text-balance">Compartir Archivos Temporalmente</h1>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto text-pretty">
        Los archivos serán comprimidos y cifrados antes de generar el enlace de descarga. Los enlaces expiran en{" "}
        <span className="font-semibold text-primary dark:text-primary">72 horas</span>.
        </p>
    </div>
  )
}