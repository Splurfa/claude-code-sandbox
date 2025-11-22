import React from 'react';
import { Slide } from './types';
import { SubHeading, MonoLabel } from './components/Typography';
import {
  VisualHero,
  VisualPhilosophy,
  VisualArchitecture,
  VisualValue,
  VisualStewards,
  VisualGateway
} from './components/Visuals';

export const slides: Slide[] = [
  {
    id: 1,
    label: "01 / State of Mind",
    title: (<span>Thought. Signal. <br /><span className="italic text-white/50">Action.</span></span>),
    body: "The distance between your intent and its execution is about to disappear.",
    supportingContent: (
      <div className="flex flex-col gap-4">
        <p>Friction between strategic intent and operational reality kills momentum. We exist to remove that latency.</p>
        <p>We return time to its most valuable owner: the human mind.</p>
      </div>
    ),
    Visual: VisualHero
  },
  {
    id: 2,
    label: "02 / Vision",
    title: "Elevation.",
    body: "There is a version of your business where you simply direct, and the world arranges itself accordingly.",
    supportingContent: (
      <div className="flex flex-col gap-4">
        <p>Traditional delegation is "lossy"—nuance fades in transit. True elevation requires a system that preserves context.</p>
        <p>We are building the interface for the high-bandwidth transmission of executive will.</p>
      </div>
    ),
    Visual: VisualPhilosophy
  },
  {
    id: 3,
    label: "03 / Mechanism",
    title: "The Invisible Architecture.",
    body: "You provide the unique human signal—the judgment, the relationship, the decision. Our infrastructure handles the rest.",
    supportingContent: (
      <div className="flex flex-col gap-4">
        <p>Our translation layer sits between your directive and the machinery of execution. It routes and realizes intent automatically.</p>
        <p>Input: Decision. Output: Result.</p>
      </div>
    ),
    Visual: VisualArchitecture
  },
  {
    id: 4,
    label: "04 / Value",
    title: "Return to the Essential.",
    body: "Scale your reach without diluting your touch. When the process is invisible, the connection becomes infinite.",
    supportingContent: (
      <div className="flex flex-col gap-4">
        <p>Automation isn't about removing the human; it's about removing the robot from the human. Focus on high-leverage creation.</p>
        <p>The ROI is not just efficiency. It is sanity.</p>
      </div>
    ),
    Visual: VisualValue
  },
  {
    id: 5,
    label: "05 / Leadership",
    title: "The Architects.",
    body: "We are stewards of the transition, ensuring technology serves the business case, not the other way around.",
    supportingContent: (
      <div className="grid grid-cols-1 gap-8">
        <div>
          <SubHeading>Derek Yellin</SubHeading>
          <MonoLabel className="mt-1 text-white/50">Chief Executive Officer</MonoLabel>
          <p className="text-white/60 text-base mt-2">Defining the human vector. Ensuring every advancement serves a strategic purpose.</p>
        </div>
        <div>
          <SubHeading>Justyn Clark</SubHeading>
          <MonoLabel className="mt-1 text-white/50">Chief Technology Officer</MonoLabel>
          <p className="text-white/60 text-base mt-2">Building the invisible machine. Architecting the layers that convert intent into execution.</p>
        </div>
      </div>
    ),
    Visual: VisualStewards
  },
  {
    id: 6,
    label: "06 / Engagement",
    title: "Begin the Transition.",
    body: "Identify the gap between your potential and your reality.",
    supportingContent: (
      <div className="flex flex-col gap-4">
        <p>The technology is ready. The question is no longer about capability, but about willingness to adapt.</p>
        <p>Join the movement and reclaim your time.</p>
      </div>
    ),
    Visual: VisualGateway
  }
];