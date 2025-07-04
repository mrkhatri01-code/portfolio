import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { HeroSection } from "@/components/hero-section"
import { ProjectsSection } from "@/components/projects-section"
import { EducationSection } from "@/components/education-section"
import { ExperienceSection } from "@/components/experience-section"
import { AboutSection } from "@/components/about-section"
import { ContactSection } from "@/components/contact-section"
import { ClientsSection } from "@/components/clients-section"
import { getSettings, getFeaturedProjects, getEducation, getExperience, getFeaturedClients } from "@/lib/data"

export default async function Home() {
  // Fetch all data with error handling
  const settings = await getSettings()
  const projects = await getFeaturedProjects()
  const education = await getEducation()
  const experience = await getExperience()
  const clients = await getFeaturedClients()

  // Use settings or fallback values
  const siteTitle = settings?.site_title || "My Portfolio"
  const siteDescription =
    settings?.site_description || "Showcasing my best work in design, development, and creative projects"
  const aboutText =
    settings?.about_text ||
    "I'm a passionate creative professional with expertise in design and development. With years of experience in the industry, I've worked on a variety of projects ranging from web design to brand identity.\n\nMy approach combines technical skills with creative thinking to deliver solutions that are both functional and aesthetically pleasing."

  // Safely extract social links, handling potential undefined values
  const socialLinks = {
    instagram: settings?.instagram_url || undefined,
    behance: settings?.behance_url || undefined,
    github: settings?.github_url || undefined,
    linkedin: settings?.linkedin_url || undefined,
    facebook: settings?.facebook_url || undefined,
    twitter: settings?.twitter_url || undefined,
    discord: settings?.discord_url || undefined,
    youtube: settings?.youtube_url || undefined,
    tiktok: settings?.tiktok_url || undefined,
  }

  return (
    <div className="flex min-h-screen flex-col">
      <Header siteTitle={siteTitle} />

      <main className="flex-1">
        <HeroSection title={siteTitle} subtitle={siteDescription} />
        {projects && projects.length > 0 && <ProjectsSection projects={projects} />}
        {clients && clients.length > 0 && <ClientsSection clients={clients} />}
        {experience && experience.length > 0 && <ExperienceSection experience={experience} />}
        {education && education.length > 0 && <EducationSection education={education} />}
        <AboutSection aboutText={aboutText} profileImageUrl={settings?.profile_image_url} />
        <ContactSection />
      </main>

      <Footer siteTitle={siteTitle} siteDescription={siteDescription} socialLinks={socialLinks} />
    </div>
  )
}

