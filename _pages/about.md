---
permalink: /
title: "About me"
author_profile: true
redirect_from: 
  - /about/
  - /about.html
header:
    overlay_image: opo0932a.jpg
    caption: "Credit: NASA, ESA, and F. Paresce (INAF-IASF, Bologna, Italy), R. O'Connell (University of Virginia, 
    Charlottesville), and the Wide Field Camera 3 Science Oversight Committee"
---


<h2>
Hello there! 

I'm a PhD candidate in astrophysics at the University of Amsterdam.
</h2>


In September 2023, I started my PhD at the [Anton Pannekoek Institute](https://api.uva.nl) for Astronomy, where I work with Dr. Silvia Toonen and Dr. Eva Laplace on the evolution of multiple-star systems. I develope analytical models and use numerical simulations to study how stellar interactions in binary and triple systems shape their orbital evolution, ultimate fate, and the transient phenomena they produce in both electromagnetic and gravitational-wave radiation.

Before that, I completed my undergraduate studies at Aristotle University of Thessaloniki and spent a semester abroad at the University of Lancashire. For my Master's thesis, I investigated mass transfer from a tertiary star onto an inner binary using hydrodynamical simulations, under the supervision Dr. Silvia Toonen.


## Key Interests

<div style="display: grid; grid-template-columns: 1fr 1fr; gap: 2rem; margin: 1rem 0; line-height: 2;">
<div>

• Binary and triple star systems 
<br>
• Stable mass transfer
<br>
• Gravitational waves from stellar interactions

</div>
<div>
• Numerical simulations
<br>
• Population synthesis
</div>
</div>

## Publications
{: #publications}

<h3>
First-author papers
</h3>

<div>
{% for post in site.publications reversed %}
  {% capture year %}{{ post.date | date: "%Y" }}{% endcapture %}
  {% if year != previous_year %}
    {% if forloop.index != 1 %}</div>{% endif %}
    <h3>{{ year }}</h3>
    {% assign previous_year = year %}
  {% endif %}
  <div style="margin-bottom: 1.5rem; padding: 1rem; background: var(--global-bg-color); border: 1px solid var(--global-border-color); border-radius: 4px;">
    <div style="font-weight: 600; font-size: 1.1rem; margin-bottom: 0.5rem;">
      {% if post.paperurl %}
        <a href="{{ post.paperurl }}" style="color: var(--global-link-color); text-decoration: none;">{{ post.title }}</a>
      {% else %}
        {{ post.title }}
      {% endif %}
    </div>
    {% if post.citation %}
      <div style="font-size: 0.9rem; font-style: italic; color: var(--text-color-muted, #666);">{{ post.citation }}</div>
    {% else %}
      {% if post.venue %}
        <div style="font-size: 0.9rem; color: var(--text-color-muted, #666);"><i>{{ post.venue }}</i></div>
      {% endif %}
    {% endif %}
    {% if post.excerpt %}
      <p style="margin-top: 0.5rem; font-size: 0.95rem;">{{ post.excerpt }}</p>
    {% endif %}
  </div>
{% endfor %}

</div> 

## Talks & Events
{: #talks-events}

<div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 1.5rem; margin: 1rem 0;">
{% for post in site.talks reversed %}
  {% capture year %}{{ post.date | date: "%Y" }}{% endcapture %}
  {% if year != previous_year %}
    {% if forloop.index != 1 %}</div>{% endif %}
    <h3>{{ year }}</h3>
    {% assign previous_year = year %}
  {% endif %}
  <div style="margin-bottom: 1.5rem; padding: 1rem; background: var(--global-bg-color); border: 1px solid var(--global-border-color); border-radius: 1px;">
    <div style="font-weight: 600; font-size: 1.1rem; margin-bottom: 0.5rem;">
      {% if post.paperurl %}
        <a href="{{ post.paperurl }}" style="color: var(--global-link-color); text-decoration: none;">{{ post.title }}</a>
      {% else %}
        {{ post.title }}
      {% endif %}
    </div>
      {% if post.venue %}
        <div style="font-size: 1.0rem; color: var(--text-color-muted, #666);"><i>{{ post.venue }}</i></div>
      {% endif %}
    {% if post.location %}
      <div style="font-size: 0.9rem; color: var(--text-color-muted, #666);">{{ post.location }}</div>
    {% endif %}
    {% if post.date %}
      <div style="font-size: 0.9rem; color: var(--text-color-muted, #666);"><strong>Date:</strong> {{ post.date | date: "%B %d, %Y" }}</div>
    {% endif %}
    {% if post.talk_type %}
      <div style="font-size: 0.9rem; color: var(--text-color-muted, #666);">{{ post.talk_type }}</div>
    {% endif %}
  </div>
{% endfor %}