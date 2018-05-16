alias wp='php /Applications/MAMP/bin/php/php7.2.1/bin/wp-cli.phar'
#MAMP Madness
export PATH=/Applications/MAMP/Library/bin:$PATH
PHP_VERSION=`ls /Applications/MAMP/bin/php/ | sort -n | tail -1`
export PATH=/Applications/MAMP/bin/php/${PHP_VERSION}bin:$PATH
