import {
  proposalRoleDefinitions,
  proposalRoleIdAliases,
} from "@/content/proposal-roles"

export const siteConfig = {
  couple: {
    bride: "Jonna Lynne D. Capacete", //Noenyl Bryle M. Gonzaga
    brideNickname: "Jonna", //Ltryl
    groom: "Ricky A. Balila II", //Ltryl B. Benitez
    groomNickname: "Ricky",
    monogram:"/monogram/monogram-new.png" ,//Ltryl
    backgroundMusic:"/background_music/Mike Mains & The Branches - I Love You Always Forever (Lyric Video).mp3"
  },
  googleAPI:{
    messageForm: "https://docs.google.com/forms/d/e/1FAIpQLScd8BvFRvQPqJIKUhSiaimQ2jjnmb3zqAMoYIRBaj6F1QuSWQ/formResponse",   //done
    message: "https://script.google.com/macros/s/AKfycbwNbmXV6gdpOI88CqM0heCVNTa_uyQaQw88cXmsB9LtjvYJXXusN-a7sBOg7cTXcGHI/exec",  //done
    guestList: "https://script.google.com/macros/s/AKfycbzlM2GNw_7ueXpsAozs0kU8OCQ02gehC0GMz4xDl4xs_u7Dd8UmV0Vt_naiGUlUrUER/exec",  //done
    guestRequest: "https://script.google.com/macros/s/AKfycbwsY9UOcNs3CGb6YqpqWDO2ivmONNAf0771XsOY6claCjovh8dXQjdQ2WHBYbP_cxzt/exec",   //done
    entourage: "https://script.google.com/macros/s/AKfycbzMq4bf26jpdyjiyQVkLO87uJt1h-wHxjUZYPqS_n1ruMh4Qk78sr5Ze6o_6yggR6LA/exec",  //done
    sponsors: "https://script.google.com/macros/s/AKfycbzsI8cHgdN0g0zuGP7L2ID1TFy4MnsokySv0HNQYyUlWmtSZX5djwW4ytgbUWNYyNH7/exec",  //done 
    proposalResponses: "https://script.google.com/macros/s/AKfycbwIUDKMoMIHVwbmr6KbgmBtlGRpMGj1Z9maeHSEwsFaXNi0dAH8WYhqbtiAfg_p5D4lgw/exec", // uses entourage script with action: proposal
    weddingDetails: "https://script.google.com/macros/s/AKfycbz7149AyRaR8Vtxf6gF374syfJMeHGzhEE8Sa6ydkcgHNXcJ7atiQdc7rSt_RTaUlhv/exec",   //done
////google share 
    googleShare: "https://docs.google.com/spreadsheets/d/16iVp_hSJzdBPzGbuIPK2CeeiW3nde1rd2jk4oJLxZQw/edit?usp=sharing",
    videoMessageForm:
      "https://docs.google.com/forms/d/e/1FAIpQLSfeGlEl4CMXWefdvCw6AOPHFS1ROku_rs-Gbofa2LkVJ0sLGQ/viewform", 
  },
  wedding: {
    date: "November 19, 2026",
    time: "9:30 AM",
    venue: "St. Benedict Parish",
    tagline: "are getting married!!!!!",
    theme: "Whimsical Spring Minimalist",
    motif: "#FFCA8B, #FFB383, #F6CEC8, #E99997, #C8C29E",
  },
  proposal: {
    // Use "Maid of Honor" for unmarried, "Matron of Honor" for married
    honorAttendant: "Matron of Honor" as "Matron of Honor" | "Maid of Honor",
    roles: proposalRoleDefinitions,
    roleIdAliases: proposalRoleIdAliases,
  },
  details: {
    rsvp: {
      deadline: "October 19, 2026",
      coordinator: "Jonna / Ricky",
      phone: "to be announced",
    },
  },
  contact: {
    bridePhone: "to be announced",
    groomPhone: "to be announced",
    email: "to be announced",
  },
  giftRegistry: {
    QR_1:{
    id: "BPI",
    src: "/QR/BPI.png",
    label: "BPI",
    accountNumber: "KAMS : ***********569",
    },
    QR_2:{
    id: "MariBank",
    src: "/QR/MariBank.png",
    label: "MariBank",
    accountNumber: "****7672",
    }
    // ,
    // QR_3:{
    // id: "Gcash",
    // src: "/QR/pleaseProvideQR.png",
    // label: "Gcash",
    // accountNumber: "to be announced",
    // }
  },
  ceremony: {
    location: "St. Benedict Parish",
    venue: "Ayala Westgrove Heights, South Blvd, Silang, 4118 Cavite, Philippines",
    map: "https://maps.app.goo.gl/yRMLmsfaZwjEWzy36",
    date: "November 19, 2026",
    day: "Thursday",
    time: "9:30 AM",
    entourageTime: "8:00 AM",
    guestsTime: "9:00 AM",
    image: ["/Details/ceremony (1).jpg", "/Details/ceremony (2).jpg","/Details/ceremony3.webp"],
  },
  reception: {
    location: "Hillbarn Tagaytay",
    venue: "Hillbarn Tagaytay, Daang Luma, Tagaytay City, 4120 Cavite",
    map: "https://maps.app.goo.gl/5ydREXRam4A1zcyT9",
    date: "November 19, 2026",
    day: "Thursday",
    time: "12:00 noon",
    image: ["/Details/reception.png", "/Details/reception1.png","/Details/reception2.png"],
  },
  dressCode: {
    theme: "Whimsical Spring Minimalist",
    sponsors: {
      title: "Sponsors",
      ninang: {
        label: "Ninang",
        description: "Long gown in the shade of silver gray.",
        image: "/Details/Ninang.png",
        palette: ["#D8D3CD", "#C0C0C0", "#A9A9A9", "#969090", "#8C8686"],
      },
      ninong: {
        label: "Ninong",
        description: "Barong Tagalog and black slacks.",
        image: "/Details/Ninong.png",
        palette: ["#D0A386", "#E3C5B3", "#E4DCD1"],
      },
    },
    entourage: {
      title: "Entourage",
      bridesmaid: {
        label: "Bridesmaids",
        description: "Long gown that suits our color motif.",
        image: "/Details/bridesmaid.png",
        palette: ["#B4A3D4", "#C8A2C8"],
      },
      groomsmen: {
        label: "Groomsmen",
        description: "Long sleeve Barong Tagalog and black slacks.",
        image: "/Details/Groomsmen.png",
        palette: ["#D0A386", "#E3C5B3", "#E4DCD1"],
      },
    },
    guests: {
      title: "Guests",
      label: "Guests",
      description: "Casual attire: Whimsical Spring.",
      image: "/Details/Guest.png",
      palette: ["#FFCA8B", "#FFB383", "#F6CEC8", "#E99997", "#C8C29E"],
    },
    paletteNote:
      "Our theme is Whimsical Spring Minimalist. Entourage: women, a flowy spring sage green dress, strictly floor length; gentlemen, a black and white suit, a white and gray suit, or sage green long sleeves with gray or brown pants — strictly no rubber shoes. Guests: casual attire, Whimsical Spring.",
    closing:
      "Thank you for helping us bring our wedding vision to life. We can't wait to celebrate with you!",
    note: "We kindly request our guests to dress in attire following our Whimsical Spring Minimalist palette.",
  },
  narratives: {
    ourStory: `Once upon a signature…

Our story began with a simple signature, one that slowly turned into something magical. He was my financial advisor, and I was there to sign documents. It was July 5, 2021, and we met at the Lobby of the building. Little did we know, that ordinary day would start a story neither of us expected.

I wasn't looking for anything, yet somehow, our connection grew in its own gentle, unexpected way. And then, on June 1, 2022, our story truly began—we became us. We found a love that feels like home.

Our journey wasn't rushed, but perfectly timed. We believe that God brought us together in His own way and season.

With hearts full of gratitude, we step into this new chapter hand in hand, trusting His plan and celebrating a love rooted in faith, patience, and grace.

Today, we choose each other- again and again- and we can't wait to celebrate this new chapter with the people we love most.`,
    groom: `The first time Mark saw Catherine, time seemed to slow down. It was an ordinary day that instantly became unforgettable: one smile, one hello, and suddenly his world had a new center. He didn't have the perfect words ready, but he knew he had met someone who felt like home.

Early conversations turned into late-night talks, sharing dreams, favorite meals, and whispered prayers for a future together. With every small adventure—coffee runs, long drives, quiet walks—Mark found himself choosing her over and over again. He loved how she laughed freely, how she listened with her whole heart, and how her faith steadied him.

There were seasons of distance and long workdays, but every reunion reminded him why he stayed patient: because Catherine was worth every mile and every minute apart. When he finally knelt to ask for her hand, it wasn't a question of "if," only "when can we start forever?"`,
    bride: `Catherine remembers the first time Mark said her name. It was gentle but sure, a kindness that made her feel both seen and safe. In that softness, she found a partner who met her with the same grace she prayed to give.

Mark's steadiness won her heart: the way he showed up, even when schedules were tight, and how he always found lightness in the small things. He celebrated her wins, held space for her worries, and never hesitated to choose "us" in every decision.

Now, as they prepare to say yes before God and the people they love most, Catherine is grateful for the patience, humor, and hope Mark brings to every day. She knows this next chapter is just the start of the love story they get to write together.`,
  },
  colors: {
    primary: "#87AE73",
    secondary: "#F5F5DC",
  },
  playlist: {
    title: "A Playlist from our hearts",
    subtitle: "Songs that have been part of our journey together",
    playlistName: "Paul and Ana Wedding",
    embedUrl:
    //https://open.spotify.com/embed/playlist/2AhKS56CXqBWMYYNrnWrsR?utm_source=generator&si=2beaa29421e94943
      "https://open.spotify.com/embed/playlist/2AhKS56CXqBWMYYNrnWrsR?utm_source=generator&theme=0&si=2beaa29421e94943",
    spotifyUrl: "https://open.spotify.com/playlist/2AhKS56CXqBWMYYNrnWrsR",
  },
  snapShare: {
    googleDriveLink:
      "https://drive.google.com/drive/folders/1XWGl7DCog_VTfCOCMz4Sp-7LXTD27ak1?usp=sharing",
    albumQR: "/QR/AlbumQR.png",
    hashtag: ["#JonnaandRickyWedding"],
    instructions: "Please scan this QR Code and upload the photos and videos you have taken during our wedding reception. We are delighted to see your snaps too!",
  },
  accommodation: {
    coordinator: {
      name: "Jonna / Ricky",
      phone: "to be announced",
    },
    hotels: [
      {
        name: "La Luna Resort",
        discount: "Offered 20% discount for early booking",
        facebook: "https://www.facebook.com/lalunabeachresortofficial",
      },
      {
        name: "GOSAM Beach Resort",
        discount: "Offered 10% discount",
        facebook: "https://www.facebook.com/profile.php?id=100083461714073",
      },
      {
        name: "Calicoan Villa",
        discount: "Offered 10% discount",
        facebook: "https://www.facebook.com/CalicoanVilla",
      },
      {
        name: "G Camp Beachfront",
        discount: "Offered 10% discount",
        facebook: "https://www.facebook.com/profile.php?id=100085772194096",
      },
      {
        name: "Punta Viajero Beach Resort",
        discount: "Offered 15% discount",
        phone: "0932 214 6408",
        facebook: "https://www.facebook.com/puntoviajeroresort",
      },
      { name: "Balay Sunset" },
      { name: "Balay Pacifico" },
      { name: "Casa Nala" },
      { name: "The Grey Inn" },
    ],
    carRentals: [
      {
        name: "Apex Car Rental Tacloban",
        facebook: "https://www.facebook.com/profile.php?id=61574882327115",
      },
      {
        name: "Cassey Wheels Car Rental",
        facebook: "https://www.facebook.com/search/top?q=casseywheels%20car%20rental",
      },
    ],
  },
}
