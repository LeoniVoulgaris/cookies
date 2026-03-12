from django.core.management.base import BaseCommand
from api.models import Product


PRODUCTS = [
    {
        'name': 'Classic Cookie Box',
        'price': '17.00',
        'image': 'img/Chocolate.png',
        'description': (
            'A box of 6 of our classic cookie flavours.\n\n'
            'Default: 2x white chocolate, 2x red velvet, 2x milk chocolate\n\n'
            'Each cookie is handmade in small batches, thoughtfully packaged, '
            'and posted with care. All our cookie boxes are beautifully hand '
            'packaged, gift wrapped and posted straight to your door.\n\n'
            'All products are made in a bakery that stores and bakes with NUTS, '
            'SOYA, GLUTEN, EGGS and DAIRY, so may contain traces due to cross contamination.'
        ),
    },
    {
        'name': 'Mixed Cookie Box',
        'price': '20.00',
        'image': '',
        'description': (
            'A box of 6 mixed cookie flavours - 3 of our classic cookie flavours '
            'and 3 of our limited cookie flavours.\n\n'
            'Default: 1x white chocolate, 1x red velvet, 1x milk chocolate, '
            '3x limited (2x mini egg, 1x cream egg)\n\n'
            'Each cookie is handmade in small batches, thoughtfully packaged, '
            'and posted with care. All our cookie boxes are beautifully hand '
            'packaged, gift wrapped and posted straight to your door.\n\n'
            'All products are made in a bakery that stores and bakes with NUTS, '
            'SOYA, GLUTEN, EGGS and DAIRY, so may contain traces due to cross contamination.'
        ),
    },
    {
        'name': 'Limited Cookie Box',
        'price': '22.00',
        'image': '',
        'description': (
            'A box of 6 of our limited cookie flavours.\n\n'
            'Default: 6x limited (3x cream egg, 3x mini eggs)\n\n'
            'Each cookie is handmade in small batches, thoughtfully packaged, '
            'and posted with care. All our cookie boxes are beautifully hand '
            'packaged, gift wrapped and posted straight to your door.\n\n'
            'All products are made in a bakery that stores and bakes with NUTS, '
            'SOYA, GLUTEN, EGGS and DAIRY, so may contain traces due to cross contamination.'
        ),
    },
    {
        'name': 'Milk Chocolate Chip Cookie',
        'price': '0.00',
        'image': 'img/Chocolate.png',
        'description': (
            'Thick Belgian milk chocolate chip cookie.\n\n'
            'Baked fresh in small batches, using pure, premium ingredients.\n\n'
            'Texture: golden edge and soft centre.\n\n'
            'We recommend microwaving for 30-45 seconds for our signature gooey finish.\n\n'
            'All our cookie boxes are beautifully hand packaged, gift wrapped and posted straight to your door.\n\n'
            'Ingredients: Plain flour, Belgian milk chocolate, butter, brown sugar, white sugar, '
            'egg, vanilla extract, baking soda, baking powder, salt\n\n'
            'All products are made in a bakery that stores and bakes with NUTS, SOYA, GLUTEN, '
            'EGGS and DAIRY, so may contain traces due to cross contamination.'
        ),
    },
    {
        'name': 'White Chocolate Chip Cookie',
        'price': '0.00',
        'image': 'img/WhiteChocolate.png',
        'description': (
            'Thick Belgian white chocolate chip cookie.\n\n'
            'Baked fresh in small batches, using pure, premium ingredients.\n\n'
            'Texture: golden edge and soft centre.\n\n'
            'We recommend microwaving for 30-45 seconds for our signature gooey finish.\n\n'
            'All our cookie boxes are beautifully hand packaged, gift wrapped and posted straight to your door.\n\n'
            'Ingredients: Plain flour, Belgian white chocolate (milk), butter, brown sugar, white sugar, '
            'egg, vanilla extract, baking soda, baking powder, salt\n\n'
            'All products are made in a bakery that stores and bakes with NUTS, SOYA, GLUTEN, '
            'EGGS and DAIRY, so may contain traces due to cross contamination.'
        ),
    },
    {
        'name': 'Red Velvet Cookie',
        'price': '0.00',
        'image': 'img/RedVelvet.png',
        'description': (
            'Thick Red Velvet cookie with rich, Belgian white chocolate chips.\n\n'
            'Baked fresh in small batches, using pure, premium ingredients.\n\n'
            'Texture: golden edge and soft centre.\n\n'
            'We recommend microwaving for 30-45 seconds for our signature gooey finish.\n\n'
            'All our cookie boxes are beautifully hand packaged, gift wrapped and posted straight to your door.\n\n'
            'Ingredients: Plain flour, Belgian white chocolate (milk), butter, brown sugar, white sugar, '
            'egg, vanilla extract, baking soda, baking powder, red colouring liquid, salt\n\n'
            'All products are made in a bakery that stores and bakes with NUTS, SOYA, GLUTEN, '
            'EGGS and DAIRY, so may contain traces due to cross contamination.'
        ),
    },
    {
        'name': 'Mini Eggs Loaded Cookie',
        'price': '0.00',
        'image': '',
        'description': (
            'Thick cookie loaded with whole mini eggs.\n\n'
            'Baked fresh in small batches, using pure, premium ingredients.\n\n'
            'Texture: golden edge and soft centre.\n\n'
            'We recommend microwaving for 30-45 seconds for our signature gooey finish.\n\n'
            'All our cookie boxes are beautifully hand packaged, gift wrapped and posted straight to your door.\n\n'
            'Ingredients: Plain flour, mini eggs chocolate (milk), butter, brown sugar, white sugar, '
            'egg, vanilla extract, baking soda, baking powder, salt\n\n'
            'All products are made in a bakery that stores and bakes with NUTS, SOYA, GLUTEN, '
            'EGGS and DAIRY, so may contain traces due to cross contamination.'
        ),
    },
    {
        'name': 'Cream Egg Stuffed Cookie',
        'price': '0.00',
        'image': '',
        'description': (
            'Thick cookie stuffed with a whole cream egg.\n\n'
            'Baked fresh in small batches, using pure, premium ingredients.\n\n'
            'Texture: golden edge and soft centre.\n\n'
            'We recommend microwaving for 30-45 seconds for our signature gooey finish.\n\n'
            'All our cookie boxes are beautifully hand packaged, gift wrapped and posted straight to your door.\n\n'
            'Ingredients: Plain flour, cream egg chocolate (milk), butter, brown sugar, white sugar, '
            'egg, vanilla extract, baking soda, baking powder, salt\n\n'
            'All products are made in a bakery that stores and bakes with NUTS, SOYA, GLUTEN, '
            'EGGS and DAIRY, so may contain traces due to cross contamination.'
        ),
    },
]


class Command(BaseCommand):
    help = 'Seed the database with Posted Cookies products'

    def handle(self, *args, **kwargs):
        # Remove products not in our new list
        new_names = {p['name'] for p in PRODUCTS}
        deleted, _ = Product.objects.exclude(name__in=new_names).delete()
        if deleted:
            self.stdout.write(f'Removed {deleted} old product(s)')

        for data in PRODUCTS:
            product, created = Product.objects.update_or_create(
                name=data['name'],
                defaults={
                    'price': data['price'],
                    'description': data['description'],
                },
            )
            # Only set image if one is specified and the product was just created
            # (don't overwrite images set via admin)
            if created and data['image']:
                product.image = data['image']
                product.save()

            action = 'Created' if created else 'Updated'
            self.stdout.write(f'{action}: {product.name}')

        self.stdout.write(self.style.SUCCESS('Product seeding complete.'))
