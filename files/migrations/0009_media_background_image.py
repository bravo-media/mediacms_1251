# Generated by Django 4.2.2 on 2024-10-26 22:26

from django.db import migrations
import files.models
import imagekit.models.fields


class Migration(migrations.Migration):

    dependencies = [
        ('files', '0008_media_font_align_media_font_bold_media_font_size_and_more'),
    ]

    operations = [
        migrations.AddField(
            model_name='media',
            name='background_image',
            field=imagekit.models.fields.ProcessedImageField(
                blank=True, help_text='This image will be placed above the body text.', max_length=500, upload_to=files.models.top_thumbnail_file_path, verbose_name='Upload Background Image'
            ),
        ),
    ]
