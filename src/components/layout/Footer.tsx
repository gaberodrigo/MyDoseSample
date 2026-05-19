import { Separator } from '@/components/ui/separator'

const FOOTER_LINKS = {
  Platform: ['Clinical Software', 'Patient App', 'Pricing', 'Roadmap'],
  Company: ['About', 'Blog', 'Careers', 'Press'],
  Resources: ['Docs', 'Compliance', 'Status', 'Security'],
  Legal: ['Privacy', 'Terms', 'HIPAA Notice'],
}

export function Footer() {
  const year = new Date().getFullYear()

  return (
    <footer className="border-t border-border/50 py-16 px-6">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-2 md:grid-cols-6 gap-10 mb-14">
          {/* Brand column */}
          <div className="col-span-2">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-7 h-7 rounded-lg bg-foreground flex items-center justify-center">
                <span className="text-background text-xs font-bold">M</span>
              </div>
              <span className="font-semibold text-sm tracking-tight">MyDose</span>
            </div>
            <p className="text-muted-foreground text-sm leading-relaxed max-w-xs">
              Protocol-based care, built as infrastructure. Intake to pharmacy, connected and yours.
            </p>
          </div>

          {/* Link columns */}
          {Object.entries(FOOTER_LINKS).map(([category, links]) => (
            <div key={category}>
              <h4 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground/70 mb-4">
                {category}
              </h4>
              <ul className="space-y-3">
                {links.map((link) => (
                  <li key={link}>
                    <a
                      href="#"
                      className="text-sm text-muted-foreground hover:text-foreground transition-colors duration-200"
                    >
                      {link}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <Separator className="opacity-50" />

        <div className="flex flex-col md:flex-row justify-between items-center gap-4 pt-8">
          <span className="text-xs text-muted-foreground/60">
            &copy; {year} MyDose, Inc. All rights reserved.
          </span>
          <div className="flex items-center gap-6">
            {['Twitter', 'GitHub', 'LinkedIn'].map((social) => (
              <a
                key={social}
                href="#"
                className="text-xs text-muted-foreground/60 hover:text-muted-foreground transition-colors"
                aria-label={`${social} profile`}
              >
                {social}
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  )
}
