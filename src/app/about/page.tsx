import { Header } from "@/components/header"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { Heart, Zap, Shield, Users } from "lucide-react"

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-background">
      <Header />

      {/* Hero Section */}
      <section className="border-b border-mehub-border bg-gradient-to-b from-mehub-card to-background py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-5xl font-bold text-mehub-text mb-6">About MEhub</h1>
          <p className="text-xl text-mehub-text-secondary mb-8">
            The community-driven platform for sharing free RuneScape 3 automation scripts
          </p>
          <p className="text-mehub-text-secondary mb-8">
            MEhub is dedicated to empowering the RS3 community with high-quality automation scripts for skilling,
            combat, bossing, and everything in between. Built by developers, for developers.
          </p>
        </div>
      </section>

      {/* Mission Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-mehub-text mb-12 text-center">Our Mission</h2>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Mission Cards */}
            <Card className="bg-mehub-card border-mehub-border p-6 text-center">
              <Zap size={40} className="text-mehub-primary mx-auto mb-4" />
              <h3 className="text-xl font-bold text-mehub-text mb-3">High Performance</h3>
              <p className="text-mehub-text-secondary">
                Optimized scripts designed to handle demanding RS3 activities reliably
              </p>
            </Card>

            <Card className="bg-mehub-card border-mehub-border p-6 text-center">
              <Users size={40} className="text-mehub-secondary mx-auto mb-4" />
              <h3 className="text-xl font-bold text-mehub-text mb-3">Community Driven</h3>
              <p className="text-mehub-text-secondary">
                Shared by experienced developers who understand the RS3 ecosystem
              </p>
            </Card>

            <Card className="bg-mehub-card border-mehub-border p-6 text-center">
              <Shield size={40} className="text-mehub-success mx-auto mb-4" />
              <h3 className="text-xl font-bold text-mehub-text mb-3">Secure & Free</h3>
              <p className="text-mehub-text-secondary">
                All scripts are open source and free to use with no hidden costs
              </p>
            </Card>

            <Card className="bg-mehub-card border-mehub-border p-6 text-center">
              <Heart size={40} className="text-mehub-primary mx-auto mb-4" />
              <h3 className="text-xl font-bold text-mehub-text mb-3">Passionate Devs</h3>
              <p className="text-mehub-text-secondary">Built by the community for improving the RS3 experience</p>
            </Card>
          </div>
        </div>
      </section>

      {/* What We Support Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-mehub-card/30">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-mehub-text mb-12 text-center">Supported Script Categories</h2>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { name: "Combat Scripts", emoji: "⚔️", desc: "Revolution++, Legacy, manual combat automation" },
              { name: "Skilling Scripts", emoji: "⛏️", desc: "Mining, smithing, archaeology, divination & more" },
              { name: "Farming Scripts", emoji: "🌾", desc: "Player-owned farm, herb runs, tree runs" },
              { name: "Bossing Scripts", emoji: "👹", desc: "Araxxor, Telos, Raksha, ED1/2/3, Arch-Glacor" },
              { name: "Slayer Scripts", emoji: "🗡️", desc: "Task automation and efficient monster farming" },
              { name: "Money Making Scripts", emoji: "💰", desc: "PVM methods, skilling-based income" },
              { name: "Dungeoneering", emoji: "🏰", desc: "Token farming and efficient floor rushing" },
              { name: "Minigames", emoji: "🎮", desc: "Cabbage Facepunch, Shattered Worlds & others" },
              { name: "Utilities", emoji: "🔧", desc: "Banking, presets, invention helpers" },
            ].map((category) => (
              <Card key={category.name} className="bg-mehub-card border-mehub-border p-6">
                <div className="text-4xl mb-3">{category.emoji}</div>
                <h3 className="text-lg font-bold text-mehub-text mb-2">{category.name}</h3>
                <p className="text-mehub-text-secondary text-sm">{category.desc}</p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Getting Started Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-mehub-text mb-12 text-center">Getting Started</h2>

          <div className="space-y-6">
            {[
              {
                step: "1",
                title: "Browse Scripts",
                desc: "Explore our marketplace and find scripts for your favorite RS3 activities",
              },
              {
                step: "2",
                title: "Download",
                desc: "Download scripts directly to your client. All files are community-vetted",
              },
              {
                step: "3",
                title: "Share Your Own",
                desc: "Created an awesome script? Upload it to MEhub and help the community",
              },
              {
                step: "4",
                title: "Contribute",
                desc: "Provide feedback, report bugs, and help improve scripts for everyone",
              },
            ].map((item) => (
              <div key={item.step} className="flex gap-6">
                <div className="flex-shrink-0">
                  <div className="flex items-center justify-center h-12 w-12 rounded-lg bg-mehub-primary text-mehub-bg font-bold text-lg">
                    {item.step}
                  </div>
                </div>
                <div className="flex-1">
                  <h3 className="text-xl font-bold text-mehub-text mb-2">{item.title}</h3>
                  <p className="text-mehub-text-secondary">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-mehub-card/30">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-mehub-text mb-8">Our Values</h2>

          <div className="space-y-4 text-left max-w-2xl mx-auto">
            <div className="p-4 border-l-4 border-mehub-primary">
              <h3 className="font-bold text-mehub-text mb-1">Free & Open</h3>
              <p className="text-mehub-text-secondary">
                All scripts are completely free. No subscriptions, no paywalls, ever.
              </p>
            </div>

            <div className="p-4 border-l-4 border-mehub-secondary">
              <h3 className="font-bold text-mehub-text mb-1">Community First</h3>
              <p className="text-mehub-text-secondary">
                Decisions are guided by what benefits the RS3 automation community most.
              </p>
            </div>

            <div className="p-4 border-l-4 border-mehub-success">
              <h3 className="font-bold text-mehub-text mb-1">Quality Focused</h3>
              <p className="text-mehub-text-secondary">
                We emphasize reliable, well-tested scripts that developers can trust.
              </p>
            </div>

            <div className="p-4 border-l-4 border-mehub-primary">
              <h3 className="font-bold text-mehub-text mb-1">Transparent</h3>
              <p className="text-mehub-text-secondary">
                Open communication about what works, what doesn't, and what's coming.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-mehub-text mb-4">Ready to Explore?</h2>
          <p className="text-mehub-text-secondary mb-8 text-lg">
            Start browsing our collection of free RS3 automation scripts today.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/marketplace">
              <Button
                  variant="outline"
                  className="border-mehub-border text-mehub-text hover:bg-orange-500/10 hover:border-orange-500 hover:text-orange-500 transition-all bg-transparent"
                  >
                Browse Scripts
              </Button>
            </Link>
            <Link href="/upload">
              <Button
                  variant="outline"
                  className="border-mehub-border text-mehub-text hover:bg-orange-500/10 hover:border-orange-500 hover:text-orange-500 transition-all bg-transparent"
              >
                Upload Script
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-mehub-border bg-mehub-card/50 py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto text-center text-mehub-text-secondary text-sm">
          <p>&copy; 2025 MEhub. Made for developers, by developers.</p>
        </div>
      </footer>
    </div>
  )
}
