"use client"

import React, { useState, useEffect, useCallback } from 'react'
import { ChevronLeft, ChevronRight, Play, Pause, Star, Quote, AlertCircle, Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Alert, AlertDescription } from '@/components/ui/alert'

interface Testimonial {
  id: string
  name: string
  role: string
  company: string
  content: string
  rating: number
  avatar?: string
  featured?: boolean
}

interface TestimonialsProps {
  testimonials?: Testimonial[]
  autoPlay?: boolean
  autoPlayInterval?: number
  showNavigation?: boolean
  showPlayPause?: boolean
  showRating?: boolean
  className?: string
  loading?: boolean
  error?: string | null
}

const defaultTestimonials: Testimonial[] = [
  {
    id: '1',
    name: 'Sarah Chen',
    role: 'Chief Technology Officer',
    company: 'TechFlow Solutions',
    content: 'This platform has revolutionized how we approach our development workflow. The intuitive interface and powerful features have increased our team productivity by 300%. Absolutely exceptional.',
    rating: 5,
    featured: true
  },
  {
    id: '2',
    name: 'Marcus Rodriguez',
    role: 'Product Manager',
    company: 'Innovation Labs',
    content: 'The attention to detail and user experience is unmatched. Our clients have noticed the difference immediately, and our conversion rates have improved significantly.',
    rating: 5
  },
  {
    id: '3',
    name: 'Emily Watson',
    role: 'Design Director',
    company: 'Creative Studio',
    content: 'Beautiful, functional, and incredibly well-thought-out. This tool has become an essential part of our creative process. The team support is also outstanding.',
    rating: 5
  },
  {
    id: '4',
    name: 'David Kim',
    role: 'Founder & CEO',
    company: 'StartupVenture',
    content: 'From day one, this solution has exceeded our expectations. The scalability and performance have grown with our business seamlessly.',
    rating: 5,
    featured: true
  }
]

const TestimonialCard: React.FC<{ testimonial: Testimonial; isActive: boolean }> = ({ testimonial, isActive }) => {
  return (
    <Card className={`
      relative overflow-hidden transition-all duration-700 ease-out
      ${isActive ? 'opacity-100 scale-100' : 'opacity-0 scale-95'}
      bg-gradient-to-br from-background via-background to-muted/20
      border-border/50 hover:border-border/80
      shadow-lg hover:shadow-xl
      backdrop-blur-sm
    `}>
      <div className="absolute inset-0 bg-gradient-to-br from-transparent via-transparent to-muted/10" />
      <div className="relative p-8 md:p-10">
        <div className="flex items-start gap-4 mb-6">
          <div className="flex-shrink-0">
            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-muted to-muted/50 flex items-center justify-center border border-border/50">
              <Quote className="w-5 h-5 text-muted-foreground" />
            </div>
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-2">
              <h3 className="font-semibold text-foreground text-lg">{testimonial.name}</h3>
              {testimonial.featured && (
                <Badge variant="secondary" className="bg-gradient-to-r from-muted to-muted/50 text-xs">
                  Featured
                </Badge>
              )}
            </div>
            <p className="text-sm text-muted-foreground">
              {testimonial.role} at {testimonial.company}
            </p>
          </div>
        </div>
        
        <blockquote className="text-foreground/90 text-lg leading-relaxed mb-6 font-light">
          "{testimonial.content}"
        </blockquote>
        
        <div className="flex items-center gap-1">
          {Array.from({ length: 5 }).map((_, i) => (
            <Star
              key={i}
              className={`w-4 h-4 ${
                i < testimonial.rating
                  ? 'text-yellow-500 fill-yellow-500'
                  : 'text-muted-foreground/30'
              }`}
            />
          ))}
          <span className="ml-2 text-sm text-muted-foreground">
            {testimonial.rating}/5
          </span>
        </div>
      </div>
    </Card>
  )
}

const LoadingState: React.FC = () => (
  <Card className="bg-background border-border/50">
    <div className="p-8 md:p-10">
      <div className="flex items-center justify-center h-64">
        <div className="flex items-center gap-3 text-muted-foreground">
          <Loader2 className="w-6 h-6 animate-spin" />
          <span className="text-lg font-light">Loading testimonials...</span>
        </div>
      </div>
    </div>
  </Card>
)

const ErrorState: React.FC<{ error: string }> = ({ error }) => (
  <Alert className="border-destructive/50 bg-destructive/5">
    <AlertCircle className="h-4 w-4" />
    <AlertDescription className="text-destructive">
      {error}
    </AlertDescription>
  </Alert>
)

const EmptyState: React.FC = () => (
  <Card className="bg-background border-border/50">
    <div className="p-8 md:p-10">
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <Quote className="w-12 h-12 text-muted-foreground/50 mx-auto mb-4" />
          <p className="text-lg font-light text-muted-foreground">
            No testimonials available
          </p>
        </div>
      </div>
    </div>
  </Card>
)

const Testimonials: React.FC<TestimonialsProps> = ({
  testimonials = defaultTestimonials,
  autoPlay = true,
  autoPlayInterval = 5000,
  showNavigation = true,
  showPlayPause = true,
  showRating = true,
  className = '',
  loading = false,
  error = null
}) => {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isPlaying, setIsPlaying] = useState(autoPlay)
  const [isPaused, setIsPaused] = useState(false)

  const nextTestimonial = useCallback(() => {
    if (testimonials.length > 0) {
      setCurrentIndex((prev) => (prev + 1) % testimonials.length)
    }
  }, [testimonials.length])

  const prevTestimonial = useCallback(() => {
    if (testimonials.length > 0) {
      setCurrentIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length)
    }
  }, [testimonials.length])

  const goToTestimonial = useCallback((index: number) => {
    setCurrentIndex(index)
  }, [])

  const togglePlayPause = useCallback(() => {
    setIsPlaying(!isPlaying)
  }, [isPlaying])

  useEffect(() => {
    if (!isPlaying || isPaused || testimonials.length <= 1) return

    const interval = setInterval(nextTestimonial, autoPlayInterval)
    return () => clearInterval(interval)
  }, [isPlaying, isPaused, nextTestimonial, autoPlayInterval, testimonials.length])

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      switch (event.key) {
        case 'ArrowLeft':
          event.preventDefault()
          prevTestimonial()
          break
        case 'ArrowRight':
          event.preventDefault()
          nextTestimonial()
          break
        case ' ':
          event.preventDefault()
          togglePlayPause()
          break
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [prevTestimonial, nextTestimonial, togglePlayPause])

  if (loading) {
    return (
      <div className={`w-full max-w-4xl mx-auto ${className}`}>
        <LoadingState />
      </div>
    )
  }

  if (error) {
    return (
      <div className={`w-full max-w-4xl mx-auto ${className}`}>
        <ErrorState error={error} />
      </div>
    )
  }

  if (!testimonials || testimonials.length === 0) {
    return (
      <div className={`w-full max-w-4xl mx-auto ${className}`}>
        <EmptyState />
      </div>
    )
  }

  return (
    <div 
      className={`w-full max-w-4xl mx-auto ${className}`}
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      role="region"
      aria-label="Customer testimonials"
    >
      <div className="relative">
        <div className="relative min-h-[400px]">
          {testimonials.map((testimonial, index) => (
            <div
              key={testimonial.id}
              className={`absolute inset-0 transition-all duration-700 ease-out ${
                index === currentIndex ? 'opacity-100 z-10' : 'opacity-0 z-0'
              }`}
              aria-hidden={index !== currentIndex}
            >
              <TestimonialCard testimonial={testimonial} isActive={index === currentIndex} />
            </div>
          ))}
        </div>

        {showNavigation && testimonials.length > 1 && (
          <div className="flex items-center justify-between mt-6">
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={prevTestimonial}
                className="bg-background/80 backdrop-blur-sm border-border/50 hover:bg-muted/50"
                aria-label="Previous testimonial"
              >
                <ChevronLeft className="w-4 h-4" />
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={nextTestimonial}
                className="bg-background/80 backdrop-blur-sm border-border/50 hover:bg-muted/50"
                aria-label="Next testimonial"
              >
                <ChevronRight className="w-4 h-4" />
              </Button>
            </div>

            <div className="flex items-center gap-2">
              {testimonials.map((_, index) => (
                <button
                  key={index}
                  onClick={() => goToTestimonial(index)}
                  className={`w-2 h-2 rounded-full transition-all duration-300 ${
                    index === currentIndex
                      ? 'bg-foreground scale-125'
                      : 'bg-muted-foreground/30 hover:bg-muted-foreground/50'
                  }`}
                  aria-label={`Go to testimonial ${index + 1}`}
                />
              ))}
            </div>

            {showPlayPause && (
              <Button
                variant="outline"
                size="sm"
                onClick={togglePlayPause}
                className="bg-background/80 backdrop-blur-sm border-border/50 hover:bg-muted/50"
                aria-label={isPlaying ? 'Pause autoplay' : 'Start autoplay'}
              >
                {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
              </Button>
            )}
          </div>
        )}
      </div>
    </div>
  )
}

export default function TestimonialsDemo() {
  return (
    <div className="min-h-screen bg-background p-8">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-light text-foreground mb-4">
            What Our Clients Say
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Discover how our solutions have transformed businesses and exceeded expectations
          </p>
        </div>
        
        <Testimonials />
      </div>
    </div>
  )
}

/*
// Button Component (@/components/ui/button)
import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground hover:bg-primary/90",
        destructive: "bg-destructive text-destructive-foreground hover:bg-destructive/90",
        outline: "border border-input bg-background hover:bg-accent hover:text-accent-foreground",
        secondary: "bg-secondary text-secondary-foreground hover:bg-secondary/80",
        ghost: "hover:bg-accent hover:text-accent-foreground",
        link: "text-primary underline-offset-4 hover:underline",
      },
      size: {
        default: "h-10 px-4 py-2",
        sm: "h-9 rounded-md px-3",
        lg: "h-11 rounded-md px-8",
        icon: "h-10 w-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button"
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    )
  }
)
Button.displayName = "Button"

export { Button, buttonVariants }

// Card Component (@/components/ui/card)
import * as React from "react"
import { cn } from "@/lib/utils"

const Card = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      "rounded-lg border bg-card text-card-foreground shadow-sm",
      className
    )}
    {...props}
  />
))
Card.displayName = "Card"

const CardHeader = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("flex flex-col space-y-1.5 p-6", className)}
    {...props}
  />
))
CardHeader.displayName = "CardHeader"

const CardTitle = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLHeadingElement>
>(({ className, ...props }, ref) => (
  <h3
    ref={ref}
    className={cn(
      "text-2xl font-semibold leading-none tracking-tight",
      className
    )}
    {...props}
  />
))
CardTitle.displayName = "CardTitle"

const CardDescription = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>(({ className, ...props }, ref) => (
  <p
    ref={ref}
    className={cn("text-sm text-muted-foreground", className)}
    {...props}
  />
))
CardDescription.displayName = "CardDescription"

const CardContent = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div ref={ref} className={cn("p-6 pt-0", className)} {...props} />
))
CardContent.displayName = "CardContent"

const CardFooter = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("flex items-center p-6 pt-0", className)}
    {...props}
  />
))
CardFooter.displayName = "CardFooter"

export { Card, CardHeader, CardFooter, CardTitle, CardDescription, CardContent }

// Badge Component (@/components/ui/badge)
import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

const badgeVariants = cva(
  "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
  {
    variants: {
      variant: {
        default:
          "border-transparent bg-primary text-primary-foreground hover:bg-primary/80",
        secondary:
          "border-transparent bg-secondary text-secondary-foreground hover:bg-secondary/80",
        destructive:
          "border-transparent bg-destructive text-destructive-foreground hover:bg-destructive/80",
        outline: "text-foreground",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return (
    <div className={cn(badgeVariants({ variant }), className)} {...props} />
  )
}

export { Badge, badgeVariants }

// Alert Component (@/components/ui/alert)
import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

const alertVariants = cva(
  "relative w-full rounded-lg border p-4 [&>svg~*]:pl-7 [&>svg+div]:translate-y-[-3px] [&>svg]:absolute [&>svg]:left-4 [&>svg]:top-4 [&>svg]:text-foreground",
  {
    variants: {
      variant: {
        default: "bg-background text-foreground",
        destructive:
          "border-destructive/50 text-destructive dark:border-destructive [&>svg]:text-destructive",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

const Alert = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & VariantProps<typeof alertVariants>
>(({ className, variant, ...props }, ref) => (
  <div
    ref={ref}
    role="alert"
    className={cn(alertVariants({ variant }), className)}
    {...props}
  />
))
Alert.displayName = "Alert"

const AlertTitle = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLHeadingElement>
>(({ className, ...props }, ref) => (
  <h5
    ref={ref}
    className={cn("mb-1 font-medium leading-none tracking-tight", className)}
    {...props}
  />
))
AlertTitle.displayName = "AlertTitle"

const AlertDescription = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("text-sm [&_p]:leading-relaxed", className)}
    {...props}
  />
))
AlertDescription.displayName = "AlertDescription"

export { Alert, AlertTitle, AlertDescription }
*/
