# Generated by Django 4.2.2 on 2024-10-26 04:22

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('files', '0003_auto_20210927_1245'),
    ]

    operations = [
        migrations.AddField(
            model_name='media',
            name='body_text',
            field=models.TextField(blank=True, help_text='Text that goes under the image'),
        ),
    ]
