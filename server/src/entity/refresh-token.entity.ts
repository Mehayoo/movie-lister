import {
	Entity,
	PrimaryGeneratedColumn,
	Column,
	BaseEntity,
	CreateDateColumn,
	UpdateDateColumn,
} from 'typeorm'

@Entity({ name: 'refresh_token' })
export class RefreshToken extends BaseEntity {
	// Extending BaseEntity to inherit  methods like "save", "remove", findOne", allowing to perform operations like refreshToken.save()
	// without needing to access the repository explicitly
	@PrimaryGeneratedColumn('uuid')
	id: string

	@Column({ type: 'varchar' })
	token: string

	@Column({ name: 'expires_in', type: 'date' })
	expiresIn: Date

	@Column({ name: 'session_id', type: 'varchar' })
	sessionId: string // Associating a token with a session ID from TMDB
	//for scenarios where I might want to track or invalidate sessions based on their TMDB session ID

	@Column({ type: 'boolean', default: false })
	revoked: boolean

	@CreateDateColumn({ name: 'created_at' })
	createdAt: Date

	@UpdateDateColumn({ name: 'updated_at' })
	updatedAt: Date
}
