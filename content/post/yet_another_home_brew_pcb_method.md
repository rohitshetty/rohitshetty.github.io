---
title: "Yet_another_home_brew_pcb_method"
date: 2021-09-13T06:17:50+05:30
draft: true
---

You have an idea for an interesting electronics circuit. You want to make it look good, reliable, and mechanically strong.   
How do you go about it?

You may find yourself using breadboard, whose name originates from the practice of using well varnished piece of wood, whose purpose was originally to cut breads. 
<Image https://en.wikipedia.org/wiki/Breadboard#/media/File:Wooden_Breadboard_Circuits.jpg>

These have evolved over years to its modern design, where we have rows and columns of perforated plastic, with conductive metal rows and grids underneath 
<Insert proper image>

These can be used to build and prototype your circuit, and is usually what is used in universities and schools because of their reusable nature. 

But, we hit a problem with this method for your awesome circuit. 
First, the components are not tightly held to the breadboard and are just inserted to the board, all it needs is a mild mechanical disturbance to dislodge it. 

Second issue is of size. You probably do not want whole breadboard to be in your final design, and want something more customized according to your use cases. 

Third major issue is with respect operating frequencies. If your circuit operates over say, 10 MHz, you can potentially have issues because the rows and columns of metal inside the breadboard acts as capacitors. 


Perfboards: 
https://en.wikipedia.org/wiki/Perfboard#/media/File:CopperCladPerfboard_1.png  
  
Our next best option, which I have been using for years is to use Perfboards, or sometimes called as Proto PCB. 
These are made up of a non conductive material with holes. These holes are then plated with copper on the other end. Each hole is isolated from others and this is why it is useful. 

We enter our components on one side, and then on the other side solder the components, and then connect them to each other using wires.
  
Over the years, I have found that using insulated copper wires, aka magnet wires makes the circuit look good and neat. Regular wires maybe too thick and cause issues when they pas s over one another. 

You can build yourself tools like [wiring pencil](https://en.wikipedia.org/wiki/Wiring_pencil) which has a spool of magnet wire at the top, passing through an empty pens body. I found this little tool to be very useful because then you don't have to deal with loose spool of wires. 

This actually is a good way to prototype your circuit, and something lot of electronics hobbyist do for one of items, but this has a problem.
If your circuit is even mildly complicated, soon you will find yourself in pain, trying to strip the wire and solder them.

It requires a lot of patience and debugging to get this working usually. 
It is also painful to have to deal with routing wires yourself, and if you are not careful there are chances you will confuse the pin outs of the parts (Because they are mounted on the other side, and usually datasheets assume you are looking into the parts and number their part pinouts as such, but you are now routing them from the other side). 


PCB

Printed circuit boards are another amazing way to build your circuit. But in all its likely, you would do this after doing either of the above methods because this is somewhat permanent way of building electronics circuit with very little space for any changes.  
  
For any new design, you would always either build it out in a breadboard or a perfboard and then only get to this stage. 
  
There are many ways to build or fabricate a printed circuit board and as an hobbyist, if you google around for ways to fabricate PCBs you are usually told in the forums by elder Makers not to fabricate it yourself and rather to outsource it some cheap PCB fab sites who usually do it in couple of dollars. 

But, I do not agree with this, generally. They of course are right, if you are a working professional who prototypes for living, or churns out circuits in large number, even as an hobbyist, it makes sense to outsource it, but I do believe brewing your PCB can be super useful. 

Reason 0: Because you can. 
Because you can. It is super fun to brew the circuits yourself and see it come to life. This is weirdly powerful and empowering to be able to do it yourself with basic chemistry. 

Reason 1: Finances
The economics and finances of a hobbyist from the developed country is usually very different from an Indian or any developing world's hobbyist. 

Example, I checked the quote from this super popular PCB fabricator from china, who is well known for fabricating PCBs at dirt cheap price. Usually < 3$ per piece etc. 

But, soon you will see that the delivery cost adds up,especially in India. 
This maybe acceptable for someone from developed countries (Example US, with average median Income of 30,000 USD / year) but can be very prohibitive for someone from India (Average Median Income of 2000 USD /  year). 

Usually with one time investment for the cost of one PCB or even cheaper, you can make 100s of PCB with some effort and time. 

This is usually a trade off. Do you value your time more than the fab cost, then it definitely makes sense to outsource it. 

Reason 2: Turn around time 
Usually you are charged a premium if you want your boards in say, less than 2 weeks. If you are someone impatient, or are actively working on the project, this can be very prohibiting. Also, you get charged extra for faster delivery times. 

Given all of these reasons, I think it is worth to know how to build your PCB as a skill set and a tool to have in your toolbox as an electronics hobbyist. 

<Link to historical development of PCB>

Part 2


Why PCB is needed 

	- why not 
	- cost in India 
	- Fast turn around time 
	- Mostly one time thing etc 
	
Theory and General process - as I understand it 
	- Other methods
		- perf board 

	- Detective story	

	
	- Start with Etching 
	- How to etch only part we want 
	- How to generate those masks 
	- How to generate the art work for the mask 

- Process and items required in TLDR 
https://www.evilmadscientist.com/2013/how-printed-circuit-boards-are-designed-1960-edition/

My Steps: 
- Art work generation
	+ - using the design pdf - We know we need trace width > 12 mils. Keep the clearance on similar level too 
	+ Remove less Copper for longer etchant 
	+ Print negative 
- How to generate Transparencies
	+ - Transparencies
		- Sticks  
	+ - Glass setup
		- printed glass setup 
		- Printed setup for top down projection 
		
- Making of Laminated PCB 
	+ - Very important to have it properly laminated - cannot express how important this is 
	+ Cut bit extra than needed 
	+ Use water 
	+ move around with paper and make sure no air is stuck 
	+ Lowest Iron setting 
	+ Iron with paper for sometime 
	+ Cut the borders and make it as near to the border as possible
	+ Focus on the edges - Edges will not be stuck correctly usually and cause all sorts of problem. So iron extra on the edges - make sure it all sticks together 
	+ Iteratively, heat and then with hand apply pressure in rubbing motion. This makes sure it is stuck. 
	+ After you are confident it is laminated correctly, let it return to room temperature.
	+ Now try to remove the protective layer - but not completely. We are just trying to make sure that the base has been laminated correctly. When you pull the layer if you see if the bottom layer too is picking itself up, then it is a bad sign. Go back and laminate more. 
	
- Exposure 
	+ - My current setup of exposure 
	+ How to calibrate and find what time works for you 
	+ Then let it calibrate 
	
- Developing 
	+ Developing is a process where uncured Resin is removed using 1% sodium carbonate 
	+ This method needs lot of attention.
	+ Put it and slowly rub for 4-5 minutes 
	+ After this see if you can find any place where the plastic is still left. 
	+ Then DONOT put the pcb back to solution as other places where successfully you have removed the resin will detoriate. 
	+ Instead, use your finder and dip it in NaCO3 - or use brush and just rub those areas
	+ And slowly you will those parts are now clear 
	+ rinse and repeat 
- Harden 
	+ Now expose your PCB back - if you still have gunk left, it will turn blue go back to the developer 
- Etching 
	+ Now that we have the masked copper - we use Ferric chloride to remove copper that is not covered. 
	+ Put it in the solution and keep on rocking. The solution works good if it is mildly heated, but it is okay 
	+ Ration 50% by weight - this process is highly exothermic  
- Test 
	+ Electrical conductance test 
		* Need to check for two things 
		* If all the traces conneted in one path are conductive 
		* If adjacent traces etc ARE NOT CONNECTED 
- Drilling 
	+ I use 0.7mm drill for 0.8mm hole to avoid issues with removing copper trace pad especially because I use diy way 
	+ once you have this pilot drill - you can increase the size by say 1mm for header pins etc safely. 
	+ 