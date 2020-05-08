<?php

namespace App\Entity;

use ApiPlatform\Core\Annotation\ApiFilter;
use ApiPlatform\Core\Annotation\ApiProperty;
use ApiPlatform\Core\Annotation\ApiResource;
use DateTimeInterface;
use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\Common\Collections\Collection;
use Doctrine\ORM\Mapping as ORM;
use Doctrine\ORM\Mapping\JoinColumn;
use Doctrine\ORM\Mapping\JoinTable;
use Symfony\Component\Serializer\Annotation\Groups;
use Symfony\Component\Validator\Constraints as Assert;
use ApiPlatform\Core\Bridge\Doctrine\Orm\Filter\SearchFilter;


/**
 * @ORM\Entity(repositoryClass="App\Repository\PostRepository")
 * @ApiResource(
 *     attributes={
 *          "order":{"createAt":"desc"}
 *     },
 *     normalizationContext={"groups"={"post:read"}},
 *     denormalizationContext={"disable_type_enforcement"=true}
 * )
 * @ApiFilter(SearchFilter::class, properties={"hashtags": "start"})
 */
class Post
{
    /**
     * @ORM\Id()
     * @ORM\GeneratedValue()
     * @ORM\Column(type="integer")
     * @Groups({"post:read"})
     */
    private $id;

    /**
     * @ORM\Column(type="text")z
     * @Groups({"post:read"})
     * @Assert\NotBlank(message="le contenu est obligatoire")
     * @Assert\Length(min="10", minMessage="le pseudo doit faire au moins 10 caractères", max="141", maxMessage="le pseudo doit faire au maximum 141 caractères")
     */
    private $content;

    /**
     * @ORM\Column(type="boolean")
     * @Groups({"post:read"})
     */
    private $isActive;

    /**
     * @ORM\Column(type="datetime")
     * @Groups({"post:read"})
     * @Assert\Type("datetime", message="la date doit etre au format YYYY-MM-DD")
     * @Assert\NotBlank(message="la date de creation est obligatoire")
     */
    private $createAt;

    /**
     * @ORM\Column(type="datetime", nullable=true)
     * @Groups({"post:read"})
     * @Assert\Type("datetime", message="la date doit etre au format YYYY-MM-DD")
     */
    private $updateAt;

    /**
     * @var MediaObject|null
     *
     * @ORM\OneToOne(targetEntity="App\Entity\MediaObject", inversedBy="post", cascade={"persist", "remove"})
     * @Groups({"post:read"})
     * @ORM\JoinColumn(nullable=false)
     * @ApiProperty(iri="http://schema.org/image")
     * @Assert\NotBlank(message="l'image est obligatoire")
     */
    private $image;

    /**
     * @ORM\ManyToMany(targetEntity="App\Entity\User")
     * @JoinTable(name="users_feelingSilly",
     *      joinColumns={@JoinColumn(name="post_id", referencedColumnName="id")},
     *      inverseJoinColumns={@JoinColumn(name="user_id", referencedColumnName="id")}
     *      )
     */
    private $feelingSilly;

    /**
     * @ORM\ManyToMany(targetEntity="App\Entity\User")
     * @JoinTable(name="users_feelingScary",
     *      joinColumns={@JoinColumn(name="post_id", referencedColumnName="id")},
     *      inverseJoinColumns={@JoinColumn(name="user_id", referencedColumnName="id")}
     *      )
     */
    private $feelingScary;

    /**
     * @ORM\ManyToMany(targetEntity="App\Entity\User")
     * @JoinTable(name="users_feelingAngry",
     *      joinColumns={@JoinColumn(name="post_id", referencedColumnName="id")},
     *      inverseJoinColumns={@JoinColumn(name="user_id", referencedColumnName="id")}
     *      )
     */
    private $feelingAngry;

    /**
     * @ORM\ManyToMany(targetEntity="App\Entity\User")
     * @JoinTable(name="users_feelingBored",
     *      joinColumns={@JoinColumn(name="post_id", referencedColumnName="id")},
     *      inverseJoinColumns={@JoinColumn(name="user_id", referencedColumnName="id")}
     *      )
     */
    private $feelingBored;

    /**
     * @ORM\ManyToOne(targetEntity="App\Entity\User", inversedBy="posts")
     * @ORM\JoinColumn(nullable=false)
     * @Groups({"post:read"})
     * @Assert\NotBlank(message="le user est obligatoire")
     */
    private $user;

    /**
     * @ORM\ManyToMany(targetEntity="App\Entity\Hashtag", inversedBy="posts", cascade={"all"}, fetch="EAGER")
     * @Groups({"post:read"})
     * @JoinTable(name="post_hashtag",
     *      joinColumns={@JoinColumn(name="post_id", referencedColumnName="id")},
     *      inverseJoinColumns={@JoinColumn(name="hashtag_id", referencedColumnName="id")}
     *      )
     */
    private $hashtags;

    public function __construct()
    {
        $this->feelingSilly = new ArrayCollection();
        $this->feelingScary = new ArrayCollection();
        $this->feelingAngry = new ArrayCollection();
        $this->feelingBored = new ArrayCollection();
        $this->hashtags = new ArrayCollection();
    }

    /**
     * @return int
     * @Groups("post:read")
     */
    public function getTotalFeelingSilly(): int {
        return count($this->feelingSilly);
    }


    /**
     * @return int
     * @Groups("post:read")
     */
    public function getTotalFeelingAngry(): int {
        return count($this->feelingAngry);
    }

    /**
     * @return int
     * @Groups("post:read")
     */
    public function getTotalFeelingBored(): int {
        return count($this->feelingBored);
    }

    /**
     * @return int
     * @Groups("post:read")
     */
    public function getTotalFeelingScary(): int {
        return count($this->feelingScary);
    }

    public function getId(): ?int
    {
        return $this->id;
    }

    public function getContent(): ?string
    {
        return $this->content;
    }

    public function setContent(string $content): self
    {
        $this->content = $content;

        return $this;
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

    /**
     * @return mixed
     */
    public function getImage()
    {
        return $this->image;
    }

    /**
     * @param mixed $image
     */
    public function setImage($image): void
    {
        $this->image = $image;
    }


    /**
     * @return Collection|User[]
     */
    public function getFeelingSilly(): Collection
    {
        return $this->feelingSilly;
    }

    public function addFeelingSilly(User $feelingSilly): self
    {
        if (!$this->feelingSilly->contains($feelingSilly)) {
            $this->feelingSilly[] = $feelingSilly;
        }

        return $this;
    }

    public function removeFeelingSilly(User $feelingSilly): self
    {
        if ($this->feelingSilly->contains($feelingSilly)) {
            $this->feelingSilly->removeElement($feelingSilly);
        }

        return $this;
    }

    /**
     * @return Collection|User[]
     */
    public function getFeelingScary(): Collection
    {
        return $this->feelingScary;
    }

    public function addFeelingScary(User $feelingScary): self
    {
        if (!$this->feelingScary->contains($feelingScary)) {
            $this->feelingScary[] = $feelingScary;
        }

        return $this;
    }

    public function removeFeelingScary(User $feelingScary): self
    {
        if ($this->feelingScary->contains($feelingScary)) {
            $this->feelingScary->removeElement($feelingScary);
        }

        return $this;
    }

    /**
     * @return Collection|User[]
     */
    public function getFeelingAngry(): Collection
    {
        return $this->feelingAngry;
    }

    public function addFeelingAngry(User $feelingAngry): self
    {
        if (!$this->feelingAngry->contains($feelingAngry)) {
            $this->feelingAngry[] = $feelingAngry;
        }

        return $this;
    }

    public function removeFeelingAngry(User $feelingAngry): self
    {
        if ($this->feelingAngry->contains($feelingAngry)) {
            $this->feelingAngry->removeElement($feelingAngry);
        }

        return $this;
    }

    /**
     * @return Collection|User[]
     */
    public function getFeelingBored(): Collection
    {
        return $this->feelingBored;
    }

    public function addFeelingBored(User $feelingBored): self
    {
        if (!$this->feelingBored->contains($feelingBored)) {
            $this->feelingBored[] = $feelingBored;
        }

        return $this;
    }

    public function removeFeelingBored(User $feelingBored): self
    {
        if ($this->feelingBored->contains($feelingBored)) {
            $this->feelingBored->removeElement($feelingBored);
        }

        return $this;
    }

    public function getUser(): User
    {
        return $this->user;
    }

    public function setUser(?User $user): self
    {
        $this->user = $user;

        return $this;
    }

    /**
     * @return Collection|Hashtag[]
     */
    public function getHashtags(): Collection
    {
        return $this->hashtags;
    }

    public function addHashtag(Hashtag $hashtag): self
    {
        if (!$this->hashtags->contains($hashtag)) {
            $this->hashtags[] = $hashtag;
            $hashtag->addPost($this);
        }

        return $this;
    }

    public function removeHashtag(Hashtag $hashtag): self
    {
        if ($this->hashtags->contains($hashtag)) {
            $this->hashtags->removeElement($hashtag);
            $hashtag->removePost($this);
        }

        return $this;
    }


    /**
     * @Groups("post:read")
     */
    public function getUserFeelingAngry() {
        return $this->getFeelingAngry();
    }
    /**
     * @Groups("post:read")
     */
    public function getUserFeelingBored() {
        return $this->getFeelingBored();
    }
    /**
     * @Groups("post:read")
     */
    public function getUserFeelingSilly() {
        return $this->getFeelingSilly();
    }
    /**
     * @Groups("post:read")
     */
    public function getUserFeelingScary() {
        return $this->getFeelingScary();
    }



}
