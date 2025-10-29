console.log('Testing imports...');

try {
    console.log('1. Testing config/env...');
    require('./config/env');
    console.log('✓ config/env OK');

    console.log('2. Testing config/db...');
    require('./config/db');
    console.log('✓ config/db OK');

    console.log('3. Testing config/jwt...');
    require('./config/jwt');
    console.log('✓ config/jwt OK');

    console.log('4. Testing middlewares/auth...');
    require('./middlewares/auth');
    console.log('✓ middlewares/auth OK');

    console.log('5. Testing routes/customerRoutes...');
    require('./routes/customerRoutes');
    console.log('✓ routes/customerRoutes OK');

    console.log('6. Testing routes/roomRoutes...');
    require('./routes/roomRoutes');
    console.log('✓ routes/roomRoutes OK');

    console.log('7. Testing routes/adminRoutes...');
    require('./routes/adminRoutes');
    console.log('✓ routes/adminRoutes OK');

    console.log('8. Testing routes/bookingRoutes...');
    require('./routes/bookingRoutes');
    console.log('✓ routes/bookingRoutes OK');

    console.log('9. Testing routes/roomAmenityRoutes...');
    require('./routes/roomAmenityRoutes');
    console.log('✓ routes/roomAmenityRoutes OK');

    console.log('10. Testing routes/promosAndOfferRoutes...');
    require('./routes/promosAndOfferRoutes');
    console.log('✓ routes/promosAndOfferRoutes OK');

    console.log('11. Testing routes/faqRoutes...');
    require('./routes/faqRoutes');
    console.log('✓ routes/faqRoutes OK');

    console.log('12. Testing routes/customerTestimonyRoutes...');
    require('./routes/customerTestimonyRoutes');
    console.log('✓ routes/customerTestimonyRoutes OK');

    console.log('13. Testing routes/contactUsRoutes...');
    require('./routes/contactUsRoutes');
    console.log('✓ routes/contactUsRoutes OK');

    console.log('14. Testing routes/propertyInfoRoutes...');
    require('./routes/propertyInfoRoutes');
    console.log('✓ routes/propertyInfoRoutes OK');

    console.log('15. Testing routes/hotelAmenityRoutes...');
    require('./routes/hotelAmenityRoutes');
    console.log('✓ routes/hotelAmenityRoutes OK');

    console.log('16. Testing routes/bookingDetailsRoutes...');
    require('./routes/bookingDetailsRoutes');
    console.log('✓ routes/bookingDetailsRoutes OK');

    console.log('17. Testing routes/roomCatagoryRoutes...');
    require('./routes/roomCatagoryRoutes');
    console.log('✓ routes/roomCatagoryRoutes OK');

    console.log('18. Testing routes/amenityBridgeRoutes...');
    require('./routes/amenityBridgeRoutes');
    console.log('✓ routes/amenityBridgeRoutes OK');

    console.log('\n✅ ALL IMPORTS SUCCESSFUL!');

} catch (error) {
    console.error('\n❌ ERROR:', error.message);
    console.error('\nStack trace:', error.stack);
}