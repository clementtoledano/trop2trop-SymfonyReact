<?php

declare(strict_types=1);

namespace DoctrineMigrations;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

/**
 * Auto-generated Migration: Please modify to your needs!
 */
final class Version20200423074937 extends AbstractMigration
{
    public function getDescription() : string
    {
        return '';
    }

    public function up(Schema $schema) : void
    {
        // this up() migration is auto-generated, please modify it to your needs
        $this->abortIf($this->connection->getDatabasePlatform()->getName() !== 'mysql', 'Migration can only be executed safely on \'mysql\'.');

        $this->addSql('CREATE TABLE hashtag (id INT AUTO_INCREMENT NOT NULL, name VARCHAR(255) NOT NULL, PRIMARY KEY(id)) DEFAULT CHARACTER SET utf8mb4 COLLATE `utf8mb4_unicode_ci` ENGINE = InnoDB');
        $this->addSql('CREATE TABLE hashtag_post (hashtag_id INT NOT NULL, post_id INT NOT NULL, INDEX IDX_EFB38414FB34EF56 (hashtag_id), INDEX IDX_EFB384144B89032C (post_id), PRIMARY KEY(hashtag_id, post_id)) DEFAULT CHARACTER SET utf8mb4 COLLATE `utf8mb4_unicode_ci` ENGINE = InnoDB');
        $this->addSql('CREATE TABLE media_object (id INT AUTO_INCREMENT NOT NULL, file_path VARCHAR(255) DEFAULT NULL, PRIMARY KEY(id)) DEFAULT CHARACTER SET utf8mb4 COLLATE `utf8mb4_unicode_ci` ENGINE = InnoDB');
        $this->addSql('CREATE TABLE image (id INT AUTO_INCREMENT NOT NULL, post_id INT NOT NULL, name VARCHAR(255) NOT NULL, url VARCHAR(255) NOT NULL, UNIQUE INDEX UNIQ_C53D045F4B89032C (post_id), PRIMARY KEY(id)) DEFAULT CHARACTER SET utf8mb4 COLLATE `utf8mb4_unicode_ci` ENGINE = InnoDB');
        $this->addSql('CREATE TABLE post (id INT AUTO_INCREMENT NOT NULL, user_id INT NOT NULL, content LONGTEXT NOT NULL, is_active TINYINT(1) NOT NULL, create_at DATETIME NOT NULL, update_at DATETIME DEFAULT NULL, INDEX IDX_5A8A6C8DA76ED395 (user_id), PRIMARY KEY(id)) DEFAULT CHARACTER SET utf8mb4 COLLATE `utf8mb4_unicode_ci` ENGINE = InnoDB');
        $this->addSql('CREATE TABLE users_feelingSilly (post_id INT NOT NULL, user_id INT NOT NULL, INDEX IDX_DAF9CF5A4B89032C (post_id), INDEX IDX_DAF9CF5AA76ED395 (user_id), PRIMARY KEY(post_id, user_id)) DEFAULT CHARACTER SET utf8mb4 COLLATE `utf8mb4_unicode_ci` ENGINE = InnoDB');
        $this->addSql('CREATE TABLE users_feelingScary (post_id INT NOT NULL, user_id INT NOT NULL, INDEX IDX_69DD83B24B89032C (post_id), INDEX IDX_69DD83B2A76ED395 (user_id), PRIMARY KEY(post_id, user_id)) DEFAULT CHARACTER SET utf8mb4 COLLATE `utf8mb4_unicode_ci` ENGINE = InnoDB');
        $this->addSql('CREATE TABLE users_feelingAngry (post_id INT NOT NULL, user_id INT NOT NULL, INDEX IDX_851AE33F4B89032C (post_id), INDEX IDX_851AE33FA76ED395 (user_id), PRIMARY KEY(post_id, user_id)) DEFAULT CHARACTER SET utf8mb4 COLLATE `utf8mb4_unicode_ci` ENGINE = InnoDB');
        $this->addSql('CREATE TABLE users_feelingBored (post_id INT NOT NULL, user_id INT NOT NULL, INDEX IDX_66E775E4B89032C (post_id), INDEX IDX_66E775EA76ED395 (user_id), PRIMARY KEY(post_id, user_id)) DEFAULT CHARACTER SET utf8mb4 COLLATE `utf8mb4_unicode_ci` ENGINE = InnoDB');
        $this->addSql('CREATE TABLE user (id INT AUTO_INCREMENT NOT NULL, image_id INT DEFAULT NULL, email VARCHAR(180) NOT NULL, roles JSON NOT NULL, password VARCHAR(255) NOT NULL, is_active TINYINT(1) NOT NULL, is_admin TINYINT(1) NOT NULL, create_at DATETIME NOT NULL, update_at DATETIME DEFAULT NULL, name VARCHAR(255) NOT NULL, UNIQUE INDEX UNIQ_8D93D649E7927C74 (email), INDEX IDX_8D93D6493DA5256D (image_id), PRIMARY KEY(id)) DEFAULT CHARACTER SET utf8mb4 COLLATE `utf8mb4_unicode_ci` ENGINE = InnoDB');
        $this->addSql('CREATE TABLE category (id INT AUTO_INCREMENT NOT NULL, name VARCHAR(255) NOT NULL, PRIMARY KEY(id)) DEFAULT CHARACTER SET utf8mb4 COLLATE `utf8mb4_unicode_ci` ENGINE = InnoDB');
        $this->addSql('ALTER TABLE hashtag_post ADD CONSTRAINT FK_EFB38414FB34EF56 FOREIGN KEY (hashtag_id) REFERENCES hashtag (id) ON DELETE CASCADE');
        $this->addSql('ALTER TABLE hashtag_post ADD CONSTRAINT FK_EFB384144B89032C FOREIGN KEY (post_id) REFERENCES post (id) ON DELETE CASCADE');
        $this->addSql('ALTER TABLE image ADD CONSTRAINT FK_C53D045F4B89032C FOREIGN KEY (post_id) REFERENCES post (id)');
        $this->addSql('ALTER TABLE post ADD CONSTRAINT FK_5A8A6C8DA76ED395 FOREIGN KEY (user_id) REFERENCES user (id)');
        $this->addSql('ALTER TABLE users_feelingSilly ADD CONSTRAINT FK_DAF9CF5A4B89032C FOREIGN KEY (post_id) REFERENCES post (id)');
        $this->addSql('ALTER TABLE users_feelingSilly ADD CONSTRAINT FK_DAF9CF5AA76ED395 FOREIGN KEY (user_id) REFERENCES user (id)');
        $this->addSql('ALTER TABLE users_feelingScary ADD CONSTRAINT FK_69DD83B24B89032C FOREIGN KEY (post_id) REFERENCES post (id)');
        $this->addSql('ALTER TABLE users_feelingScary ADD CONSTRAINT FK_69DD83B2A76ED395 FOREIGN KEY (user_id) REFERENCES user (id)');
        $this->addSql('ALTER TABLE users_feelingAngry ADD CONSTRAINT FK_851AE33F4B89032C FOREIGN KEY (post_id) REFERENCES post (id)');
        $this->addSql('ALTER TABLE users_feelingAngry ADD CONSTRAINT FK_851AE33FA76ED395 FOREIGN KEY (user_id) REFERENCES user (id)');
        $this->addSql('ALTER TABLE users_feelingBored ADD CONSTRAINT FK_66E775E4B89032C FOREIGN KEY (post_id) REFERENCES post (id)');
        $this->addSql('ALTER TABLE users_feelingBored ADD CONSTRAINT FK_66E775EA76ED395 FOREIGN KEY (user_id) REFERENCES user (id)');
        $this->addSql('ALTER TABLE user ADD CONSTRAINT FK_8D93D6493DA5256D FOREIGN KEY (image_id) REFERENCES media_object (id)');
    }

    public function down(Schema $schema) : void
    {
        // this down() migration is auto-generated, please modify it to your needs
        $this->abortIf($this->connection->getDatabasePlatform()->getName() !== 'mysql', 'Migration can only be executed safely on \'mysql\'.');

        $this->addSql('ALTER TABLE hashtag_post DROP FOREIGN KEY FK_EFB38414FB34EF56');
        $this->addSql('ALTER TABLE user DROP FOREIGN KEY FK_8D93D6493DA5256D');
        $this->addSql('ALTER TABLE hashtag_post DROP FOREIGN KEY FK_EFB384144B89032C');
        $this->addSql('ALTER TABLE image DROP FOREIGN KEY FK_C53D045F4B89032C');
        $this->addSql('ALTER TABLE users_feelingSilly DROP FOREIGN KEY FK_DAF9CF5A4B89032C');
        $this->addSql('ALTER TABLE users_feelingScary DROP FOREIGN KEY FK_69DD83B24B89032C');
        $this->addSql('ALTER TABLE users_feelingAngry DROP FOREIGN KEY FK_851AE33F4B89032C');
        $this->addSql('ALTER TABLE users_feelingBored DROP FOREIGN KEY FK_66E775E4B89032C');
        $this->addSql('ALTER TABLE post DROP FOREIGN KEY FK_5A8A6C8DA76ED395');
        $this->addSql('ALTER TABLE users_feelingSilly DROP FOREIGN KEY FK_DAF9CF5AA76ED395');
        $this->addSql('ALTER TABLE users_feelingScary DROP FOREIGN KEY FK_69DD83B2A76ED395');
        $this->addSql('ALTER TABLE users_feelingAngry DROP FOREIGN KEY FK_851AE33FA76ED395');
        $this->addSql('ALTER TABLE users_feelingBored DROP FOREIGN KEY FK_66E775EA76ED395');
        $this->addSql('DROP TABLE hashtag');
        $this->addSql('DROP TABLE hashtag_post');
        $this->addSql('DROP TABLE media_object');
        $this->addSql('DROP TABLE image');
        $this->addSql('DROP TABLE post');
        $this->addSql('DROP TABLE users_feelingSilly');
        $this->addSql('DROP TABLE users_feelingScary');
        $this->addSql('DROP TABLE users_feelingAngry');
        $this->addSql('DROP TABLE users_feelingBored');
        $this->addSql('DROP TABLE user');
        $this->addSql('DROP TABLE category');
    }
}
