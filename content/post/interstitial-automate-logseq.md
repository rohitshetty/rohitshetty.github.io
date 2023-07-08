---
title: "Periodic reminders for Interstitial journaling"
date: 2023-07-08T08:01:23+05:30
draft: false
---

I first came across Interstitial Journaling from [this](https://nesslabs.com/interstitial-journaling) post by Nesslabs a long time back. I used it for some time (few hours at most!).

My ADHD makes it difficult for me to be aware of the passage of time when I am either in hyperfocus or procrastination mode. Additionally, not having a solid system to log it was bothering me. Where should I store this file? What would be the easiest way to give it a timestamped name? Argh! Decisions, decisions!

A few months back, when I got diagnosed with ADHD, I wanted to build an app that would run in the background on my laptop. Every 30 minutes or so, it would pop up and ask me what I was doing and if I was using my time consciously. I researched options but couldn't really find anything that fit the bill. So, I decided to build it myself (spoiler: I didn't).

I looked into [SafeEyes](https://slgobinath.github.io/SafeEyes/) for inspiration. It was almost doing what I wanted—it ran in the background and would block the whole screen every N minutes, forcing you to take a break. I needed something similar, but instead of a break screen, I wanted a GUI text box for input.

I learnt GTK+ 3 and RPC library in Python to build this. I even started writing some code, but then I lost momentum, and it went nowhere.

For the past few months, I have been using Logseq. I really like the UI and the app itself. It simplifies the process of logging my day, even though I don't do it regularly. The home page serves as a running journal that automatically opens to the current date, so I don't have to worry about organizing the logs or naming them. I also use the Logseq [Interstitial Heading Plugin](https://github.com/QWxleA/logseq-interstitial-heading-plugin), which helps me enter the current time more easily.

{{<figure src="/images/interstitial-automate-logseq/logseq-interstitial.png" caption="One day in Logseq" caption-position="bottom" caption-effect="none">}}

Now I have a good way to do interstitial journaling, but I still struggle with forgetting to log it down.

Initially, I started out by attempting to write a Python script to solve this. However, I soon realized that I already have the necessary tools to do this, and all I really need is a simple glue script.

- I use Linux Mint with the [i3 window manager](https://i3wm.org/).
- Linux Mint and Ubuntu come with `notify-send` for sending native notifications, which takes care of visual reminders.
- i3 has `i3-msg`, which I can use to send commands to the i3 window manager to locate a window with the title "Logseq" and switch to its view. If you are using a different window manager, [xdotool](https://github.com/jordansissel/xdotool) can be a good alternative.
- Additionally, I already have `paplay` installed because my system has PulseAudio, which can be used to play chimes as audio reminders.
- Finally, I can utilize `cron` to schedule and run this glue script every 30 minutes.

```bash
#!/bin/bash

# Show notification for 5 seconds
notify-send "Log what you are doing now!" -t 5000

# Play the beep 3 times?
for i in {1..3}
do
  #this audio clip was copied from /usr/share/sounds/ubuntu/notifications that was bundled with my OS
  # Replace the path to the location of this project - use the full path
  paplay /home/rohit/dev/projects/interstital-reminder/Xylo.ogg
done

# Jump to Logseq
# You can use xdotool if you do not use i3wm
i3-msg "[title=\"Logseq\"] focus"

paplay /home/rohit/dev/projects/interstital-reminder/Mallet.ogg

```

Run this with `bash run.sh` - it should

1. Should display a notification
2. play the reminder sound ("Xylo.ogg") three times and
3. Switch the focus to Logseq, accompanied by a completion sound ("Mallet.ogg").

Now, in order to run this script every 30 minutes, we will utilize [cron](https://linuxhint.com/cron_jobs_complete_beginners_tutorial/).

Use `crontab -e` to open your cron definition and append

```bash
SHELL=/bin/bash

*/30 * * * * XDG_RUNTIME_DIR=/run/user/$(id -u) DISPLAY=:0 bash /home/rohit/dev/projects/interstital-reminder/run.sh > /home/rohit/dev/projects/interstital-reminder/log.txt 2>&1
```

`SHELL=/bin/bash` - Use bash instead of default `sh`

`*/30 * * * *` - Cron pattern for running every 30 mins - [Resource to explore](https://crontab.guru/)

`XDG_RUNTIME_DIR=/run/user/$(id -u) DISPLAY=:0` - To ensure that `paplay` and `notify-send` work correctly when executed by cron, you need to set the environment variables using this.

Since cron runs independently, it does not inherit environment variables automatically. For more detailed explanations, you can refer to [this](https://askubuntu.com/a/1360992) and [this](https://askubuntu.com/questions/872792/what-is-xdg-runtime-dir) resources.

`bash /home/rohit/dev/projects/interstital-reminder/run.sh > /home/rohit/dev/projects/interstital-reminder/log.txt 2>&1` - run the script using bash, redirect the output to a text file.

Demo here: https://youtu.be/_HS7i2e-WlI

You can find the code here: https://github.com/rohitshetty/Interstitial-reminder

I hope that I will continue using Interstitial journaling with this tool and that hacking this together was not just another way for me to procrastinate :P
