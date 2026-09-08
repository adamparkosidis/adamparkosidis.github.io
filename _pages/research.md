---
layout: archive
title: "Highlights"
permalink: /research/
header:
    hero_orbit: true
    hero_tagline: "A donor star overflows its Roche lobe, feeding gas onto a compact object — the physics at the heart of my research."
---

{% include base_path %}

{% assign selected_publications = site.publications | where: "selected", true | sort: "date" | reverse %}
{% assign selected_talks = site.talks | where: "selected", true | sort: "date" | reverse %}

<!-- Each block is a .section-band: the bands alternate between the two page
     backgrounds (see _sass/layout/_section_band.scss) and supply the vertical
     spacing between blocks. -->
<section class="section-band">
<h1 style="text-align: center;">Highlights</h1>

<p class="research-intro">
I am broadly interested in the evolution and final fate of interacting binary stars. I study how stellar interactions reshape their orbits and what the resulting systems look like by the time we observe them through electromagnetic and gravitational radiation. My current research focuses on mass transfer in eccentric orbits a regime long treated as a special case, but which turns out to be more common than previously thought. I study how mass flows between the binary components, how, in some cases, it escapes the system, how these exchanges alter the orbital evolution, and how they ultimately determine the final fate of these systems. I make theoretical predictions that can be compared with real binaries, from post-mass-transfer systems observed by Gaia to gravitational-wave sources detected by the LVK and, in the future, by LISA. My goal is to understand how binary interactions reshape the lives of stars and ultimately determine their deaths.
</p>
</section>

{% if selected_publications.size > 0 %}
<section class="section-band">
<h1 style="text-align: center;">Selected publications </h1>

<div class="research-selection">
  {% for pub in selected_publications %}
    {% include research-publication.html item=pub %}
  {% endfor %}
</div>

<p class="research-selection__more"><a href="{{ base_path }}/publications/">All publications &rarr;</a></p>
</section>
{% endif %}

{% if selected_talks.size > 0 %}
<section class="section-band">
<h1 style="text-align: center;">Selected talks </h1>

<div class="research-selection">
  {% for talk in selected_talks %}
    {% include research-talk.html item=talk %}
  {% endfor %}
</div>

<p class="research-selection__more"><a href="{{ base_path }}/talks/">All talks &rarr;</a></p>
</section>
{% endif %}
