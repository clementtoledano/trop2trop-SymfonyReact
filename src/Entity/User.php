<?php

namespace App\Entity;

use ApiPlatform\Core\Annotation\ApiProperty;
use ApiPlatform\Core\Annotation\ApiResource;
use ApiPlatform\Core\Annotation\ApiSubresource;
use DateTimeInterface;
use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\Common\Collections\Collection;
use Doctrine\ORM\Mapping as ORM;
use Symfony\Component\Security\Core\User\UserInterface;
use Symfony\Component\Serializer\Annotation\Groups;
use Symfony\Component\Validator\Constraints as Assert;
use Symfony\Bridge\Doctrine\Validator\Constraints\UniqueEntity;


/**
 * @ORM\Entity(repositoryClass="App\Repository\UserRepository")
 * @ApiResource(
 *     itemOperations={
 *          "get",
 *         "put"={
 *                  "access_control"="is_granted('IS_AUTHENTICATED_FULLY') and object == user"
 *          }
 *     },
 *     normalizationContext={"groups"={"user:read"}},
 *     denormalizationContext={"disable_type_enforcement"=true}
 *     )
 * @UniqueEntity("email", message="l'email est deja utilisé")
 * @UniqueEntity("name", message="le pseudo est deja utilisé")
 */
class User implements UserInterface
{
    const ROLE_USER = 'ROLE_USER';
    const ROLE_ADMIN = 'ROLE_ADMIN';
    const ROLE_SUPERADMIN = 'ROLE_SUPERADMIN';

    const DEFAULT_ROLES = [self::ROLE_USER];

    /**
     * @ORM\Id()
     * @ORM\GeneratedValue()
     * @ORM\Column(type="integer")
     * @Groups({"post:read","user:read"})
     */
    private $id;


    /**
     * @ORM\Column(type="string", length=180, unique=true)
     * @Groups({"post:read","user:read"})
     * @Assert\NotBlank(message="l'email est obligatoire")
     * @Assert\Email(message="le format de l'email doit etre correct")
     */
    private $email;

    /**
     * @ORM\Column(type="simple_array", length=200)
     * @Groups({"post:read","user:read"})
     */
    private $roles;

    /**
     * @var string The hashed password
     * @ORM\Column(type="string")
     * @Assert\Regex(
     *      pattern="/(?=.*[A-Z])(?=.*[a-z])(?=.*[0-9]).{8,}/",
     *      message="minimum 8 caractères, une majuscule et un chiffre"
     * )
     * @Assert\NotBlank(message="le password est obligatoire")
     */
    private $password;

    /**
     * @ORM\Column(type="boolean")
     * @Groups({"post:read","user:read"})
     */
    private $isActive;

    /**
     * @ORM\Column(type="datetime")
     * @Assert\Type("datetime", message="la date doit etre au format YYYY-MM-DD")
     * @Assert\NotBlank(message="la date de creation est obligatoire")
     * @Groups({"post:read","user:read"})
     */
    private $createAt;

    /**
     * @ORM\Column(type="datetime", nullable=true)
     * @Assert\Type("datetime", message="la date doit etre au format YYYY-MM-DD")
     * @Groups({"user:read"})
     */
    private $updateAt;

    /**
     * @ORM\Column(type="string", length=255)
     * @Groups({"post:read","user:read"})
     * @Assert\Length(min="3", minMessage="le pseudo doit faire au moins 3 caractères", max="20", maxMessage="le pseudo doit faire au maximum 20 caractères")
     * @Assert\NotBlank(message="le pseudo est obligatoire")
     */
    private $name;

    /**
     * @ORM\OneToMany(targetEntity="App\Entity\Post", mappedBy="user", orphanRemoval=true)
     * @ApiSubresource()
     */
    private $posts;

    /**
     * @var MediaObject|null
     *
     * @ORM\ManyToOne(targetEntity=MediaObject::class)
     * @ORM\JoinColumn(nullable=true)
     * @ApiProperty(iri="http://schema.org/image")
     */
    public $image;


    public function __construct()
    {
        $this->posts = new ArrayCollection();
        $this->roles = self::DEFAULT_ROLES;

    }

    /**
     * @Groups({"user:read"})
     */
    public function getContentUrl(): string
    {
        if (isset($this->image->filePath)) {
            return '/media/' . $this->image->filePath;
        }
        return '';
    }

    public function getId(): ?int
    {
        return $this->id;
    }

    public function getEmail(): ?string
    {
        return $this->email;
    }

    public function setEmail(string $email): self
    {
        $this->email = $email;

        return $this;
    }

    /**
     * A visual identifier that represents this user.
     *
     * @see UserInterface
     */
    public function getUsername(): string
    {
        return (string)$this->email;
    }

    /**
     * @see UserInterface
     */
    public function getRoles(): array
    {
        $roles = $this->roles;
        return array_unique($roles);
    }

    public function setRoles(array $roles): self
    {
        $this->roles = $roles;

        return $this;
    }

    /**
     * @see UserInterface
     */
    public function getPassword(): string
    {
        return (string)$this->password;
    }

    public function setPassword(string $password): self
    {
        $this->password = $password;

        return $this;
    }

    /**
     * @see UserInterface
     */
    public function getSalt()
    {
        // not needed when using the "bcrypt" algorithm in security.yaml
    }

    /**
     * @see UserInterface
     */
    public function eraseCredentials()
    {
        // If you store any temporary, sensitive data on the user, clear it here
        // $this->plainPassword = null;
    }

    public function getIsActive(): ?bool
    {
        return $this->isActive;
    }

    public function setIsActive(bool $isActive): self
    {
        $this->isActive = $isActive;

        return $this;
    }

    public function getCreateAt(): ?DateTimeInterface
    {
        return $this->createAt;
    }

    public function setCreateAt($createAt): self
    {
        $this->createAt = $createAt;

        return $this;
    }

    public function getUpdateAt(): ?DateTimeInterface
    {
        return $this->updateAt;
    }

    public function setUpdateAt($updateAt): self
    {
        $this->updateAt = $updateAt;

        return $this;
    }

    public function getName(): ?string
    {
        return $this->name;
    }

    public function setName(string $name): self
    {
        $this->name = $name;

        return $this;
    }

    /**
     * @return Collection|Post[]
     */
    public function getPosts(): Collection
    {
        return $this->posts;
    }

    public function addPost(Post $post): self
    {
        if (!$this->posts->contains($post)) {
            $this->posts[] = $post;
            $post->setUser($this);
        }

        return $this;
    }

    public function removePost(Post $post): self
    {
        if ($this->posts->contains($post)) {
            $this->posts->removeElement($post);
            // set the owning side to null (unless already changed)
            if ($post->getUser() === $this) {
                $post->setUser(null);
            }
        }

        return $this;
    }

    public function __toString(): string
    {
        return $this->name;
    }


}
