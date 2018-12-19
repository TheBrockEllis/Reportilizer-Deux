FROM php:7.1-apache

# wkhtmltopdf dependencies
RUN apt-get update && apt-get install -y fontconfig libfreetype6 \
    libjpeg62-turbo libpng16-16 libx11-6 libxcb1 libxext6 \
    libxrender1 xfonts-75dpi xfonts-base

# wkhtmltopdf
RUN curl -LO https://downloads.wkhtmltopdf.org/0.12/0.12.5/wkhtmltox_0.12.5-1.stretch_amd64.deb && \
    dpkg -i wkhtmltox_0.12.5-1.stretch_amd64.deb && \
    rm wkhtmltox_0.12.5-1.stretch_amd64.deb

# Composer
RUN curl -s https://getcomposer.org/installer | php && \
    mv composer.phar /usr/local/bin/composer && \
    chmod +x /usr/local/bin/composer

RUN apt-get install git -y

RUN apt-get install vim -y
