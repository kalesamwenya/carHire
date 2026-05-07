-- File: seeds/citydrive_chatbot_seed.sql

-- --------------------------------------------------------
-- Dumping data for table `chatbot_keywords`
-- --------------------------------------------------------

INSERT INTO `chatbot_keywords` (`intent`, `keywords`, `answer`, `follow_up`, `priority`, `action_links`) VALUES

-- GREETINGS
('greeting', 'hello,hi,hey,yo,sup,good morning,good afternoon,good evening', 
'Hello! 👋 Welcome to CityDrive Hire. We provide premium vehicle rentals for business and leisure in Lusaka. How can I help you today?', 
'You can ask about our fleet, pricing, or how to make a booking! 🚗', 10, NULL),

-- BOOKING PROCESS (Mapped from 'visit')
('booking', 'book,reserve,rent,hire,reservation,how to book,im coming', 
'Booking is simple! 📱 You can select your preferred car, choose your dates, and pay via Mobile Money or Card.', 
'Would you like to see our available vehicles? 😊', 10, '{"primary":{"label":"Browse Fleet","url":"/cars"},"secondary":{"label":"Contact Us","url":"/contact"}}'),

-- LOCATION
('location', 'where,location,address,directions,how to find,office,lusaka', 
'Our main office is located in Lusaka, Zambia. 📍 We also offer vehicle delivery to KK International Airport.', 
'Would you like the exact office address or airport pickup details?', 10, '{"primary":{"label":"Get Directions","url":"/location"}}'),

-- FLEET (Mapped from 'bible/ministries')
('fleet', 'cars,vehicles,suv,hilux,land cruiser,executive,fleet,what cars', 
'We offer a range of premium vehicles, including Toyota Hilux, Land Cruisers, and Executive Sedans. All cars are well-maintained and air-conditioned.', 
'Are you looking for a 4x4 or a city sedan? 🚙', 10, '{"primary":{"label":"View Fleet","url":"/cars"}}'),

-- PRICING (Mapped from 'giving')
('pricing', 'price,cost,rate,how much,cheap,expensive,charges,tithe', 
'Our rates are competitive and vary based on the vehicle type and duration. Long-term rentals enjoy special discounts! 💰', 
'Would you like a quote for a specific vehicle?', 10, '{"primary":{"label":"View Rates","url":"/pricing"}}'),

-- SERVICE TYPES (Mapped from 'service_time')
('service_type', 'self drive,chauffeur,driver,with driver,what time', 
'We offer both self-drive options for total freedom and professional chauffeur services if you’d prefer to sit back and relax.', 
'Which service would you like to inquire about?', 9, NULL),

-- REQUIREMENTS (Mapped from 'about')
('requirements', 'requirements,documents,license,id,what do i need,age', 
'To rent a car, you need a valid Driver’s License (held for 2+ years), a National ID or Passport, and a quick KYC check.', 
'Is your license Zambian or International? 🪪', 9, '{"primary":{"label":"Terms & Conditions","url":"/terms"}}'),

-- CONTACT
('contact', 'contact,phone,email,call,whatsapp,number,talk to someone', 
'We are here for you! 😊 You can reach us on +260 972 338 115 or via email at support@citydrivehire.com.', 
'Choose the best way for you ❤️', 10, '{"primary":{"label":"Call Now","url":"tel:+260972338115"},"secondary":{"label":"WhatsApp Chat","url":"https://wa.me/260972338115?text=Hello%20CityDrive%20Hire"}}'),

-- AIRPORT (Mapped from 'online')
('airport', 'airport,kkia,pickup,delivery,flight,live', 
'We provide seamless airport pickup and drop-off at Kenneth Kaunda International Airport. Just provide your flight details! ✈️', 
'Would you like to book an airport transfer?', 8, '{"primary":{"label":"Book Airport Transfer","url":"/airport"}}'),

-- FALLBACK
('fallback', 'help,assist,unknown,question,confused', 
'Hmm 🤔 I didn’t quite catch that, but I’d love to help you get on the road!', 
'Try asking: “How do I book?” or “What cars do you have?”', 1, NULL);